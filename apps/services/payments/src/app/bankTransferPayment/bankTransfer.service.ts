import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Charge } from '@island.is/clients/charge-fjs-v2'
import {
  BankTransferErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import { PaymentMethod, PaymentStatus } from '../../types'
import { environment } from '../../environments'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  BankTransferPaymentResult,
  BankTransferStatus,
  CreateBankTransferPaymentInput,
  blikkCreatePaymentResponseSchema,
  blikkGetPaymentResponseSchema,
} from './bankTransfer.types'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { CreateBankTransferInput } from './dtos/createBankTransfer.input'
import { CreateBankTransferResponse } from './dtos/createBankTransfer.response'
import { VerifyBankTransferInput } from './dtos/verifyBankTransfer.input'
import { VerifyBankTransferResponse } from './dtos/verifyBankTransfer.response'
import { BankTransferPayment } from './models/bankTransferPayment.model'
import {
  generateBankTransferChargeFJSPayload,
  isBlikkStatus,
  mapBlikkStatusToBankTransferStatus,
  toBlikkItem,
} from './bankTransfer.utils'

const REQUEST_TIMEOUT_MS = 10000

const createLogPrefix = (
  paymentFlowId: string,
  correlationId: string,
  providerPaymentId: string,
) =>
  `[${paymentFlowId}][correlationId: ${correlationId}][rrn: ${providerPaymentId}]`

/**
 * Service for the bank-transfer payment method (Blikk is the v1 provider).
 *
 * Wraps the provider HTTP API (Blikk ECom v3: `POST /ecom/v3/payments`, `GET /ecom/v3/payments/:id`)
 * and returns normalized {@link BankTransferPaymentResult}s so callers stay provider-agnostic.
 * The verify/confirm domain logic is added in later steps.
 */
@Injectable()
export class BankTransferService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(BankTransferModuleConfig.KEY)
    private readonly config: ConfigType<typeof BankTransferModuleConfig>,
    @InjectModel(BankTransferPayment)
    private readonly bankTransferPaymentModel: typeof BankTransferPayment,
    private readonly paymentFlowService: PaymentFlowService,
    @Inject(PaymentFlowModuleConfig.KEY)
    private readonly paymentFlowConfig: ConfigType<
      typeof PaymentFlowModuleConfig
    >,
  ) {}

  async createPayment(
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

    const logPrefix = createLogPrefix(
      input.paymentFlowId,
      input.correlationId,
      data.id,
    )

    this.logger.info(`${logPrefix}Bank transfer payment created`, {
      paymentFlowId: input.paymentFlowId,
      status: result.status,
    })

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
   * Initiates a new bank-transfer attempt against the provider and persists our row.
   *
   * Ordering (Blikk first, then persist — mirrors invoice/card; an orphan Blikk payment from a crash
   * between steps 5 and 6 self-heals via Blikk's 300 s `expiresAt`):
   *
   * 1. Reject if the flow is already PAID.
   * 2. Reject if an active `bank_transfer_payment` row already exists for the flow (one attempt at a
   *    time per flow, enforced by the partial unique index).
   * 3. Compute amount + items from the flow's charges.
   * 4. Generate a per-attempt `correlationId` (UUID). Used as BOTH the row's `id` AND the value sent
   *    to Blikk as `sourceReferenceId`. **Never `paymentFlowId`** — Blikk's idempotency cache would
   *    block retries after a terminal failure.
   * 5. Call Blikk's create. On failure, emit `payment_failed` and re-throw.
   * 6. Persist `bank_transfer_payment` with the provider's response.
   * 7. Emit `payment_started`.
   */
  async create(
    input: CreateBankTransferInput,
  ): Promise<CreateBankTransferResponse> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      input.paymentFlowId,
    )

    const [{ paymentStatus }, existing] = await Promise.all([
      this.paymentFlowService.getPaymentFlowStatus(paymentFlow),
      this.findActiveBankTransferPayment({ paymentFlowId: input.paymentFlowId }),
    ])

    if (paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    if (existing) {
      throw new BadRequestException(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )
    }

    const { catalogItems, totalPrice } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges,
      )

    const correlationId = uuid()
    // Blikk POSTs callbacks to the FE Next.js handler, which proxies through the GraphQL gateway to
    // our `verify` endpoint. The backend never receives Blikk's webhook directly.
    const callbackUrl = `${this.paymentFlowConfig.webOrigin}/api/bank-transfer/callback`
    const partnerRedirectUrl = `${this.paymentFlowConfig.webOrigin}/${input.locale}/${input.paymentFlowId}`
    // Blikk's `expiresAt` is Unix seconds. We pin to now + 5 min so an abandoned attempt self-cleans
    // on Blikk's side and the user can retry on the same flow (a fresh attempt = fresh correlationId).
    const expiresAt = Math.floor(Date.now() / 1000) + 300

    let providerResult: BankTransferPaymentResult
    try {
      providerResult = await this.createPayment({
        correlationId,
        paymentFlowId: input.paymentFlowId,
        amount: totalPrice,
        currency: 'ISK',
        callbackUrl,
        partnerRedirectUrl,
        expiresAt,
        items: catalogItems,
      })
    } catch (error) {
      // No row persisted yet — emit a controller-level failure event mirroring card's pre-charge
      // failure events (`cardPayment.controller.ts:109,178`) and rethrow so the caller gets the
      // mapped error code.
      await this.paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: input.paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          reason: 'payment_failed',
          message: `Failed to create bank transfer: ${
            (error as Error)?.message ?? 'unknown'
          }`,
          metadata: { error: (error as Error)?.message },
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
    })

    await this.paymentFlowService.logPaymentFlowUpdate(
      {
        paymentFlowId: input.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reason: 'payment_started',
        message: 'Bank transfer started',
        metadata: {
          providerPaymentId: providerResult.providerPaymentId,
          correlationId,
        },
      },
      { useRetry: true, throwOnError: false },
    )

    return {
      providerPaymentId: providerResult.providerPaymentId,
      scaRedirectUrl: providerResult.scaRedirectUrl,
    }
  }

  /**
   * Verifies the current state of a bank transfer attempt — the polling target for the frontend AND
   * the path the provider callback delegates to. Idempotent end-to-end:
   *
   * - **Already-PAID flow** → return SUCCESS immediately, no provider call.
   * - Otherwise fetch the latest status from the provider, then branch:
   *   - **SUCCESS** → trigger {@link confirmBankTransferPayment} (itself fully idempotent; the
   *     fulfillment claim is gated so only the first concurrent caller creates the FJS charge).
   *   - **ERROR / REJECTED / CANCELLED** → soft-delete the row, gated by `isDeleted:false` so only the
   *     first of concurrent verifies fires the `payment_failed` event.
   *   - **PENDING** → persist a `lastKnownStatus` change if the provider's raw status moved.
   *
   * The active row is intentionally resolved with `isDeleted:false` — a late poll arriving after a
   * terminal failure was already processed gets `BankTransferNotFound`, and the caller re-resolves via
   * the flow's overall status.
   */
  async verify(
    input: VerifyBankTransferInput,
  ): Promise<VerifyBankTransferResponse> {
    const row = await this.findActiveBankTransferPayment(input)

    if (!row) {
      throw new BadRequestException(BankTransferErrorCode.BankTransferNotFound)
    }

    // Already-PAID short-circuit.
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      row.paymentFlowId,
    )
    const { paymentStatus } =
      await this.paymentFlowService.getPaymentFlowStatus(paymentFlow)
    if (paymentStatus === PaymentStatus.PAID) {
      return { status: BankTransferStatus.SUCCESS }
    }

    const logPrefix = createLogPrefix(
      row.paymentFlowId,
      row.sourceReferenceId,
      row.providerPaymentId,
    )

    const result = await this.getPayment(row.providerPaymentId)

    switch (result.status) {
      case BankTransferStatus.SUCCESS:
        await this.confirmBankTransferPayment({
          correlationId: row.id,
          paymentFlowId: row.paymentFlowId,
          providerPaymentId: row.providerPaymentId,
          rawStatus: result.rawStatus,
        })
        break

      case BankTransferStatus.ERROR:
      case BankTransferStatus.REJECTED:
      case BankTransferStatus.CANCELLED: {
        // delete the row if error occurs, so new brank transfer payment can be created
        const [affectedRows] = await this.bankTransferPaymentModel.update(
          { isDeleted: true, lastKnownStatus: result.rawStatus },
          { where: { id: row.id, isDeleted: false } },
        )

        if (affectedRows > 0) {
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
        break
      }

      case BankTransferStatus.PENDING:
        if (result.rawStatus !== row.lastKnownStatus) {
          await this.bankTransferPaymentModel.update(
            { lastKnownStatus: result.rawStatus },
            { where: { id: row.id, isDeleted: false } },
          )
        }
        break
    }

    return { status: result.status, message: result.message }
  }

  /**
   * Resolves the active bank-transfer attempt by either `providerPaymentId` (callback path)
   * or `paymentFlowId` (frontend polling path).`
   */
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

  /**
   * Confirms a settled bank transfer. Called once the provider reports terminal SUCCESS.
   *
   * Idempotent: (1) record the provider's status on our own row; (2) build the FJS charge payload;
   * (3) delegate to {@link PaymentFlowService.createBankTransferFulfillment}, which no-ops if the flow is
   * already fulfilled and creates the FJS charge only on the first payment; (4) notify upstream.
   * Concurrency is handled inside `createBankTransferFulfillment` (the partial unique index gates the
   * single FJS charge); the success notification is idempotent on the consumer side.
   */
  async confirmBankTransferPayment({
    correlationId,
    paymentFlowId,
    providerPaymentId,
    rawStatus,
  }: {
    /**
     * The per-attempt UUID we generated when creating this bank transfer — equal to
     * `bank_transfer_payment.id` and to the value we sent to Blikk as `sourceReferenceId`. NOT the
     * provider's own `providerPaymentId`.
     */
    correlationId: string
    paymentFlowId: string
    providerPaymentId: string
    rawStatus: string
  }): Promise<void> {
    // 1. Record the provider's terminal status on our own row (idempotent).
    await this.bankTransferPaymentModel.update(
      { lastKnownStatus: rawStatus },
      { where: { id: correlationId, paymentFlowId, isDeleted: false } },
    )

    // 2. Build the FJS charge payload.
    const chargePayload = await this.buildFjsChargePayload(
      paymentFlowId,
      providerPaymentId,
    )

    // 3. Create the fulfillment and, only on the first payment, the FJS charge.
    await this.paymentFlowService.createBankTransferFulfillment(
      paymentFlowId,
      correlationId,
      chargePayload,
    )

    // 4. Notify upstream of the completed payment.
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

  /**
   * Builds the FJS charge payload for a settled bank transfer.
   */
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
