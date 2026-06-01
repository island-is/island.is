import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Charge } from '@island.is/clients/charge-fjs-v2'
import {
  BankTransferErrorCode,
  FjsErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { retry } from '@island.is/shared/utils/server'

import { PaymentMethod, PaymentStatus } from '../../types'
import { environment } from '../../environments'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import {
  BankTransferFailureReason,
  BankTransferPaymentResult,
  BankTransferStatus,
  BankTransferStatusOverlay,
  CreateBankTransferPaymentInput,
  blikkCreatePaymentResponseSchema,
  blikkGetPaymentResponseSchema,
} from './bankTransfer.types'
import { BankTransferModuleConfig } from './bankTransfer.config'
import {
  CancelBankTransferInput,
  CancelBankTransferResponse,
  CreateBankTransferInput,
  CreateBankTransferResponse,
  VerifyBankTransferInput,
  VerifyBankTransferResponse,
} from './dtos'
import { BankTransferPayment } from './models/bankTransferPayment.model'
import {
  createLogPrefix,
  generateBankTransferChargeFJSPayload,
  isBankTransferFailureStatus,
  isBlikkStatus,
  isRowExpired,
  mapBlikkStatusToBankTransferStatus,
  rowLogPrefix,
  toBlikkItem,
} from './bankTransfer.utils'

const REQUEST_TIMEOUT_MS = 10000

/** Service for the bank-transfer payment method (Blikk is the v1 provider). */
@Injectable()
export class BankTransferService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(BankTransferModuleConfig.KEY)
    private readonly config: ConfigType<typeof BankTransferModuleConfig>,
    @InjectModel(BankTransferPayment)
    private readonly bankTransferPaymentModel: typeof BankTransferPayment,
    @InjectModel(PaymentFulfillment)
    private readonly paymentFulfillmentModel: typeof PaymentFulfillment,
    // forwardRef breaks the BankTransferPaymentModule <-> PaymentFlowModule cycle.
    @Inject(forwardRef(() => PaymentFlowService))
    private readonly paymentFlowService: PaymentFlowService,
    @Inject(PaymentFlowModuleConfig.KEY)
    private readonly paymentFlowConfig: ConfigType<
      typeof PaymentFlowModuleConfig
    >,
  ) {}

  /** Initiates a new bank-transfer attempt with Blikk and persists the row. */
  async create(
    input: CreateBankTransferInput,
  ): Promise<CreateBankTransferResponse> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      input.paymentFlowId,
    )

    const [isEligible, existing] = await Promise.all([
      this.paymentFlowService.isEligibleToBePaid(input.paymentFlowId),
      this.findActiveBankTransferPayment({
        paymentFlowId: input.paymentFlowId,
      }),
    ])

    // already paid
    if (!isEligible) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    if (existing) {
      // throws an error if the bank transfer payment is already paid or still pending
      await this.handleExistingActiveBankTransferRow(existing)
    }

    const { catalogItems, totalPrice } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges,
      )

    const correlationId = uuid()
    const callbackUrl = `${this.paymentFlowConfig.webOrigin}/api/bank-transfer/callback`
    const partnerRedirectUrl = `${this.paymentFlowConfig.webOrigin}/${input.locale}/${input.paymentFlowId}`
    const expiresAtSeconds =
      Math.floor(Date.now() / 1000) + this.config.paymentTtlSeconds
    const expiresAt = new Date(expiresAtSeconds * 1000)

    let providerResult: BankTransferPaymentResult
    try {
      providerResult = await this.createBankTransferPayment({
        correlationId,
        paymentFlowId: input.paymentFlowId,
        amount: totalPrice,
        currency: 'ISK',
        callbackUrl,
        partnerRedirectUrl,
        expiresAt: expiresAtSeconds,
        items: catalogItems,
      })
    } catch (error) {
      const errorMessage = (error as Error)?.message ?? 'unknown'
      await this.paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: input.paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          reason: 'payment_failed',
          message: `Failed to create bank transfer: ${errorMessage}`,
          metadata: { error: errorMessage },
        },
        { useRetry: true, throwOnError: false },
      )
      throw error
    }

    await this.bankTransferPaymentModel.create({
      id: correlationId,
      paymentFlowId: input.paymentFlowId,
      sourceReferenceId: correlationId,
      provider: 'blikk',
      providerPaymentId: providerResult.providerPaymentId,
      scaRedirectUrl: providerResult.scaRedirectUrl,
      amount: totalPrice,
      lastKnownStatus: providerResult.rawStatus,
      expiresAt,
    })

    await this.paymentFlowService.logPaymentFlowUpdate(
      {
        paymentFlowId: input.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reason: 'payment_started',
        message: 'Bank transfer created',
        metadata: {
          providerPaymentId: providerResult.providerPaymentId,
          correlationId,
        },
      },
      { useRetry: true, throwOnError: false },
    )

    const logPrefix = createLogPrefix(
      input.paymentFlowId,
      correlationId,
      providerResult.providerPaymentId,
    )

    this.logger.info(`${logPrefix}Bank transfer payment created`, {
      paymentFlowId: input.paymentFlowId,
      status: providerResult.status,
    })

    return {
      providerPaymentId: providerResult.providerPaymentId,
      scaRedirectUrl: providerResult.scaRedirectUrl,
      expiresAt,
    }
  }

  /** Fetches the latest status from Blikk and finalizes the attempt on terminal. Idempotent. */
  async verify(
    input: VerifyBankTransferInput,
  ): Promise<VerifyBankTransferResponse> {
    const row = await this.findActiveBankTransferPayment(input)

    if (!row) {
      throw new BadRequestException(BankTransferErrorCode.BankTransferNotFound)
    }

    // Already-PAID short-circuit.
    const isEligible = await this.paymentFlowService.isEligibleToBePaid(
      row.paymentFlowId,
    )
    if (!isEligible) {
      return { status: BankTransferStatus.SUCCESS }
    }

    const logPrefix = rowLogPrefix(row)
    const result = await this.getPayment(row.providerPaymentId)

    if (result.status === BankTransferStatus.SUCCESS) {
      await this.finalizeBankTransferSuccess({
        correlationId: row.id,
        paymentFlowId: row.paymentFlowId,
        providerPaymentId: row.providerPaymentId,
        rawStatus: result.rawStatus,
      })
    } else if (isBankTransferFailureStatus(result.status)) {
      await this.finalizeBankTransferFailure(row, result, logPrefix)
    } else if (result.rawStatus !== row.lastKnownStatus) {
      // PENDING raw-status drift
      await this.bankTransferPaymentModel.update(
        { lastKnownStatus: result.rawStatus },
        { where: { id: row.id, isDeleted: false } },
      )
    }

    return { status: result.status, message: result.message }
  }

  /** Soft-deletes the active row and best-effort cancels on Blikk for still-pending rows. */
  async cancel(
    input: CancelBankTransferInput,
  ): Promise<CancelBankTransferResponse> {
    const row = await this.findActiveBankTransferPayment({
      paymentFlowId: input.paymentFlowId,
    })

    if (!row) {
      return { ok: true }
    }

    const logPrefix = rowLogPrefix(row)
    const mappedStatus = mapBlikkStatusToBankTransferStatus(row.lastKnownStatus)

    // Refuse to cancel a settled payment. Money already moved and a
    // paymentFulfillment exists (or is being created)
    if (mappedStatus === BankTransferStatus.SUCCESS) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    if (mappedStatus === BankTransferStatus.PENDING && !isRowExpired(row)) {
      await this.cancelPaymentBestEffort(row.providerPaymentId, logPrefix)
    }

    // Race-safe soft-delete: bail if finalizeBankTransferSuccess (or any
    // concurrent writer) flipped lastKnownStatus between fetch and write.
    const [affectedRows] = await this.bankTransferPaymentModel.update(
      { isDeleted: true },
      {
        where: {
          id: row.id,
          isDeleted: false,
          lastKnownStatus: row.lastKnownStatus,
        },
      },
    )

    if (affectedRows === 0) {
      // Either already soft-deleted by a concurrent cancel (idempotent → ok)
      // or finalizeBankTransferSuccess flipped to SUCCESS under us (refuse).
      const fresh = await this.bankTransferPaymentModel.findOne({
        where: { id: row.id },
      })
      if (
        fresh &&
        mapBlikkStatusToBankTransferStatus(fresh.lastKnownStatus) ===
          BankTransferStatus.SUCCESS
      ) {
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }
      return { ok: true }
    }

    this.logger.info(`${logPrefix}Bank transfer cancelled`, {
      paymentFlowId: row.paymentFlowId,
      mappedStatus,
    })

    // Only active-PENDING cancels emit; terminal-failed cleanups already emitted payment_failed.
    if (mappedStatus === BankTransferStatus.PENDING && !isRowExpired(row)) {
      await this.paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: row.paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          reason: 'payment_cancelled',
          message: 'Bank transfer cancelled by user',
          metadata: {
            providerPaymentId: row.providerPaymentId,
            correlationId: row.id,
          },
        },
        { useRetry: true, throwOnError: false },
      )
    }

    return { ok: true }
  }

  /** Gets the bank-transfer status for a payment flow; refreshes from Blikk on fresh PENDING. */
  async getBankTransferStatus(
    paymentFlowId: string,
  ): Promise<BankTransferStatusOverlay | null> {
    const row = await this.bankTransferPaymentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    if (!row) {
      return null
    }

    const isExpired = isRowExpired(row)
    let mapped = mapBlikkStatusToBankTransferStatus(row.lastKnownStatus)

    // Fresh PENDING → ask Blikk so SSR after SCA redirect lands on the final state immediately.
    if (mapped === BankTransferStatus.PENDING && !isExpired) {
      const refreshed = await this.refreshFromBlikkOrWarn(row)

      if (refreshed) {
        if (refreshed.status === BankTransferStatus.SUCCESS) {
          await this.finalizeBankTransferSuccess({
            correlationId: row.id,
            paymentFlowId,
            providerPaymentId: row.providerPaymentId,
            rawStatus: refreshed.rawStatus,
          })
          return null
        }

        if (isBankTransferFailureStatus(refreshed.status)) {
          await this.finalizeBankTransferFailure(
            row,
            refreshed,
            rowLogPrefix(row),
          )
          return {
            paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
            updatedAt: row.modified,
            lastBankTransferFailure:
              refreshed.status as unknown as BankTransferFailureReason,
          }
        }

        if (refreshed.rawStatus !== row.lastKnownStatus) {
          await this.bankTransferPaymentModel.update(
            { lastKnownStatus: refreshed.rawStatus },
            {
              where: {
                id: row.id,
                isDeleted: false,
                lastKnownStatus: row.lastKnownStatus,
              },
            },
          )
        }
        mapped = mapBlikkStatusToBankTransferStatus(refreshed.rawStatus)
      }
    }

    if (mapped === BankTransferStatus.SUCCESS) {
      return null
    }

    if (isExpired) {
      void this.softDeleteRow(row.id)
      return null
    }

    if (mapped === BankTransferStatus.PENDING) {
      return {
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        updatedAt: row.modified,
        bankTransferScaRedirectUrl: row.scaRedirectUrl ?? undefined,
        bankTransferExpiresAt: row.expiresAt,
      }
    }

    return {
      paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
      updatedAt: row.modified,
      lastBankTransferFailure: mapped as unknown as BankTransferFailureReason,
    }
  }

  /** Records a settled SUCCESS, creates the fulfillment + FJS charge, and notifies upstream. */
  async finalizeBankTransferSuccess({
    correlationId,
    paymentFlowId,
    providerPaymentId,
    rawStatus,
  }: {
    correlationId: string
    paymentFlowId: string
    providerPaymentId: string
    rawStatus: string
  }): Promise<void> {
    const [affectedRows] = await this.bankTransferPaymentModel.update(
      { lastKnownStatus: rawStatus },
      { where: { id: correlationId, paymentFlowId, isDeleted: false } },
    )

    // no affected rows ⇒ bail
    if (affectedRows === 0) {
      return
    }

    const chargePayload = await this.buildFjsChargePayload(
      paymentFlowId,
      providerPaymentId,
    )

    await this.createBankTransferFulfillment(
      paymentFlowId,
      correlationId,
      chargePayload,
    )

    await this.paymentFlowService.logPaymentFlowUpdate(
      {
        paymentFlowId,
        type: 'success',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reason: 'payment_completed',
        message: 'Bank transfer payment completed',
        metadata: { providerPaymentId },
      },
      { useRetry: true, throwOnError: false },
    )
  }

  /** Inserts the fulfillment row and creates the FJS charge with retries. Idempotent. */
  async createBankTransferFulfillment(
    paymentFlowId: string,
    confirmationRefId: string,
    chargePayload: Charge,
  ): Promise<void> {
    const existing = await this.paymentFulfillmentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    if (existing) {
      this.logger.info(
        `[${paymentFlowId}] Bank transfer already fulfilled — skipping FJS charge`,
      )
      return
    }

    try {
      await this.paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'bank_transfer',
        confirmationRefId,
      })
    } catch (error) {
      if ((error as Error)?.name === 'SequelizeUniqueConstraintError') {
        this.logger.info(
          `[${paymentFlowId}] Bank transfer fulfillment already claimed — skipping FJS charge`,
        )
        return
      }
      throw error
    }

    try {
      await retry(
        () =>
          this.paymentFlowService.createFjsCharge(paymentFlowId, chargePayload),
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          logger: this.logger,
          logPrefix: `[${paymentFlowId}] Create bank transfer FJS charge`,
          shouldRetryOnError: (error) =>
            error.message !== FjsErrorCode.AlreadyCreatedCharge,
        },
      )
    } catch (error) {
      // Fulfillment is committed; we don't un-pay. Missing FJS charge needs manual reconciliation.
      this.logger.error(
        `[${paymentFlowId}] CRITICAL: bank transfer settled but FJS charge failed after retries — manual reconciliation required`,
        { error: (error as Error)?.message },
      )
    }
  }

  async createBankTransferPayment(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    const body = {
      amount: input.amount,
      currency: input.currency,
      sourceReferenceId: input.correlationId,
      callbackUrl: input.callbackUrl,
      partnerRedirectUrl: input.partnerRedirectUrl,
      source: input.source,
      expiresAt: input.expiresAt,
      items: input.items?.map(toBlikkItem),
    }

    const data = await this.request(
      'POST',
      '/ecom/v3/payments',
      blikkCreatePaymentResponseSchema,
      BankTransferErrorCode.FailedToCreateBankTransfer,
      input.paymentFlowId,
      body,
    )

    const result = this.toResult(data)

    return result
  }

  async getPayment(
    providerPaymentId: string,
  ): Promise<BankTransferPaymentResult> {
    const data = await this.request(
      'GET',
      `/ecom/v3/payments/${encodeURIComponent(providerPaymentId)}`,
      blikkGetPaymentResponseSchema,
      BankTransferErrorCode.FailedToFetchBankTransfer,
      providerPaymentId,
    )

    return this.toResult(data)
  }

  /**
   * Returns the latest non-deleted row's `providerPaymentId` if it is in SUCCESS, else `null`.
   * Used by the refund saga to look up the original Blikk payment id when the fulfillment lacks an
   * FJS charge (inline-pay path where the original FJS create failed).
   */
  async getRefundableProviderPaymentId(
    paymentFlowId: string,
  ): Promise<string | null> {
    const row = await this.bankTransferPaymentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
      order: [['created', 'DESC']],
    })

    if (
      !row ||
      mapBlikkStatusToBankTransferStatus(row.lastKnownStatus) !==
        BankTransferStatus.SUCCESS
    ) {
      return null
    }

    return row.providerPaymentId
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  /** Resolves an existing row found at the start of `create`: backfill SUCCESS, reject fresh PENDING, else soft-delete. */
  private async handleExistingActiveBankTransferRow(
    existing: BankTransferPayment,
  ): Promise<void> {
    const mapped = mapBlikkStatusToBankTransferStatus(existing.lastKnownStatus)

    if (mapped === BankTransferStatus.SUCCESS) {
      await this.finalizeBankTransferSuccess({
        correlationId: existing.id,
        paymentFlowId: existing.paymentFlowId,
        providerPaymentId: existing.providerPaymentId,
        rawStatus: existing.lastKnownStatus,
      })
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    if (mapped === BankTransferStatus.PENDING && !isRowExpired(existing)) {
      throw new BadRequestException(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )
    }

    // Stale PENDING: check Blikk before discarding to catch the orphan-SUCCESS case (callback lost).
    if (mapped === BankTransferStatus.PENDING) {
      const refreshed = await this.refreshFromBlikkOrWarn(existing)
      if (refreshed?.status === BankTransferStatus.SUCCESS) {
        await this.finalizeBankTransferSuccess({
          correlationId: existing.id,
          paymentFlowId: existing.paymentFlowId,
          providerPaymentId: existing.providerPaymentId,
          rawStatus: refreshed.rawStatus,
        })
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }
    }

    await this.softDeleteRow(existing.id)
  }

  /** Best-effort Blikk GET; logs and returns null on failure. Not for verify (which must throw). */
  private async refreshFromBlikkOrWarn(
    row: Pick<BankTransferPayment, 'providerPaymentId' | 'paymentFlowId'>,
  ): Promise<BankTransferPaymentResult | null> {
    try {
      return await this.getPayment(row.providerPaymentId)
    } catch (e) {
      this.logger.warn(
        `[${row.paymentFlowId}] Blikk refresh failed during status read`,
        { error: (e as Error)?.message },
      )
      return null
    }
  }

  /** Race-guarded persist of a terminal failure + payment_failed event (only the race winner fires). */
  private async finalizeBankTransferFailure(
    row: BankTransferPayment,
    result: BankTransferPaymentResult,
    logPrefix: string,
  ): Promise<void> {
    const [affectedRows] = await this.bankTransferPaymentModel.update(
      { lastKnownStatus: result.rawStatus },
      {
        where: {
          id: row.id,
          isDeleted: false,
          lastKnownStatus: row.lastKnownStatus,
        },
      },
    )

    if (affectedRows === 0) {
      return
    }

    this.logger.info(`${logPrefix}Bank transfer payment failed`, {
      paymentFlowId: row.paymentFlowId,
      status: result.status,
      message: result.message,
    })
    await this.paymentFlowService.logPaymentFlowUpdate(
      {
        paymentFlowId: row.paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reason: 'payment_failed',
        message: `Bank transfer ${result.status}`,
        metadata: {
          providerPaymentId: row.providerPaymentId,
          rawStatus: result.rawStatus,
          providerMessage: result.message,
        },
      },
      { useRetry: true, throwOnError: false },
    )
  }

  /** Looks up the active row by providerPaymentId or paymentFlowId. */
  private async findActiveBankTransferPayment(
    input: VerifyBankTransferInput,
  ): Promise<BankTransferPayment | null> {
    if (input.providerPaymentId) {
      return this.bankTransferPaymentModel.findOne({
        where: {
          provider: 'blikk',
          providerPaymentId: input.providerPaymentId,
          isDeleted: false,
        },
      })
    }

    if (input.paymentFlowId) {
      return this.bankTransferPaymentModel.findOne({
        where: { paymentFlowId: input.paymentFlowId, isDeleted: false },
      })
    }

    return null
  }

  /** Soft-deletes the row; idempotent via the `isDeleted: false` guard. */
  private softDeleteRow(rowId: string): Promise<[number]> {
    return this.bankTransferPaymentModel.update(
      { isDeleted: true },
      { where: { id: rowId, isDeleted: false } },
    )
  }

  /** Best-effort DELETE on Blikk. Swallows non-2xx + network failures; local soft-delete is authoritative. */
  private async cancelPaymentBestEffort(
    providerPaymentId: string,
    logPrefix: string,
  ): Promise<void> {
    const url = `${this.config.baseUrl}/ecom/v3/payments/${encodeURIComponent(
      providerPaymentId,
    )}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.config.apiKey,
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        // 404 = unknown payment; 409 = already terminal. Both are no-ops from our perspective.
        this.logger.warn(`${logPrefix}Blikk cancel returned non-2xx`, {
          providerPaymentId,
          status: response.status,
          statusText: response.statusText,
        })
        return
      }

      this.logger.info(`${logPrefix}Blikk cancel succeeded`, {
        providerPaymentId,
      })
    } catch (e) {
      this.logger.warn(`${logPrefix}Blikk cancel request failed`, {
        providerPaymentId,
        error: (e as Error)?.message,
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  /** Builds the FJS charge payload for a settled bank transfer. */
  private async buildFjsChargePayload(
    paymentFlowId: string,
    providerPaymentId: string,
  ): Promise<Charge> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      paymentFlowId,
    )
    const { catalogItems, totalPrice } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges,
      )

    return generateBankTransferChargeFJSPayload({
      paymentFlow,
      charges: catalogItems,
      totalPrice,
      systemId: environment.chargeFjs.systemId,
      providerPaymentId,
    })
  }

  private toResult(data: {
    id: string
    status: string
    scaRedirectUrl?: string
    message?: string
  }): BankTransferPaymentResult {
    if (!isBlikkStatus(data.status)) {
      this.logger.warn(`[${data.id}] Unknown bank transfer status received`, {
        status: data.status,
      })
    }

    return {
      providerPaymentId: data.id,
      rawStatus: data.status,
      status: mapBlikkStatusToBankTransferStatus(data.status),
      // Empty string means back-channel SCA (no redirect) — surface as undefined.
      scaRedirectUrl: data.scaRedirectUrl || undefined,
      message: data.message || undefined,
    }
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    schema: z.ZodType<T>,
    errorCode: BankTransferErrorCode,
    logRef: string,
    body?: unknown,
  ): Promise<T> {
    const logPrefix = logRef ? `[${logRef}] ` : ''
    const url = `${this.config.baseUrl}${path}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.config.apiKey,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })
    } catch (e) {
      this.logger.error(`${logPrefix}Bank transfer request failed`, {
        method,
        path,
        error: e?.message,
        timestamp: new Date().toISOString(),
      })
      throw new BadRequestException(errorCode)
    } finally {
      clearTimeout(timeout)
    }

    let responseBody: unknown
    try {
      responseBody = await response.json()
    } catch {
      responseBody = undefined
    }

    if (!response.ok) {
      this.logger.error(
        `${logPrefix}Bank transfer returned an error response`,
        {
          method,
          path,
          status: response.status,
          statusText: response.statusText,
          responseBody,
        },
      )
      throw new BadRequestException(errorCode)
    }

    const parsed = schema.safeParse(responseBody)
    if (!parsed.success) {
      this.logger.error(`${logPrefix}Failed to parse bank transfer response`, {
        method,
        path,
        parseError: parsed.error,
        timestamp: new Date().toISOString(),
      })
      throw new BadRequestException(errorCode)
    }

    return parsed.data
  }
}
