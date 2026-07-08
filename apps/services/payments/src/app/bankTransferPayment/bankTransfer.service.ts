import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'

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
  BlikkClientError,
  BlikkClientService,
  CreateBlikkPaymentRequest,
} from '@island.is/clients/blikk'
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
  BankTransferPaymentResult,
  BankTransferStatus,
  BankTransferStatusOverlay,
  CreateBankTransferPaymentInput,
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
  deriveBankTransferFailureReason,
  generateBankTransferChargeFJSPayload,
  isBankTransferFailureStatus,
  isBlikkStatus,
  isOnboardingRequired,
  isRowExpired,
  mapBlikkStatusToBankTransferStatus,
  mapRawStatusToBankTransferPendingStatus,
  rowLogPrefix,
  toBlikkItem,
} from './bankTransfer.utils'

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
    private readonly blikkClient: BlikkClientService,
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
        debtorExternalId: paymentFlow.payerNationalId,
        bankAccountNumber: input.bankAccountNumber,
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

    return {
      providerPaymentId: providerResult.providerPaymentId,
      scaRedirectUrl: providerResult.scaRedirectUrl,
      expiresAt,
      onboardingRequired: providerResult.onboardingRequired,
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

    // getPayment throws on transport failure — FE polling retries on the next tick.
    const result = await this.getPayment(row.providerPaymentId)
    await this.finalizeFromBlikkResult(row, result)

    const scaRedirectUrl =
      result.scaRedirectUrl ?? row.scaRedirectUrl ?? undefined

    return {
      status: result.status,
      message: result.message,
      pendingStatus: mapRawStatusToBankTransferPendingStatus(
        result.rawStatus,
        scaRedirectUrl,
      ),
      scaRedirectUrl,
      failureReason:
        deriveBankTransferFailureReason(result.status, row) ?? undefined,
    }
  }

  /**
   * Cancels the active bank-transfer attempt for a flow. Blikk only cancels DRAFT payments, so:
   * DRAFT → best-effort provider cancel; SCA_REQUIRED (payer has not approved yet) → abandon
   * locally and let the provider payment lapse via its TTL;
   * PENDING/SCA_COMPLETE (payer initiated/approved — settlement may be in flight) → refuse.
   * The local row is soft-deleted for DRAFT / SCA_REQUIRED / terminal / expired attempts.
   * Idempotent.
   */
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
    const cachedMappedStatus = mapBlikkStatusToBankTransferStatus(
      row.lastKnownStatus,
    )

    // Refuse to cancel a settled payment. Money already moved and a
    // paymentFulfillment exists (or is being created).
    if (cachedMappedStatus === BankTransferStatus.SUCCESS) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    let mappedStatus = cachedMappedStatus
    let lastKnownStatus = row.lastKnownStatus

    if (cachedMappedStatus === BankTransferStatus.PENDING) {
      // Authoritative refresh BEFORE any destructive action — including for an expired row. A
      // transfer that settled just before expiry whose callback was lost must be finalized, not
      // discarded, or the payer could pay a second time. (Same refresh-before-discard guard as
      // getBankTransferStatus.)
      const refreshed = await this.refreshFromBlikkOrWarn(row)
      if (refreshed) {
        await this.finalizeFromBlikkResult(row, refreshed)
        if (refreshed.status === BankTransferStatus.SUCCESS) {
          throw new BadRequestException(
            PaymentServiceCode.PaymentFlowAlreadyPaid,
          )
        }
        mappedStatus = refreshed.status
        lastKnownStatus = refreshed.rawStatus
      }
      // Blikk only cancels DRAFT payments, so what happens next depends on how far the attempt
      // got (skipped entirely for an expired row — its TTL already elapsed, nothing to cancel):
      // - DRAFT: best-effort provider cancel. A DRAFT cannot settle, so a refused/failed cancel
      //   is safe to ignore — the payment lapses via the TTL we sent Blikk on create.
      // - SCA_REQUIRED: the payer has not approved yet and Blikk cannot cancel past DRAFT —
      //   abandon locally and let the provider payment lapse via its TTL.
      // - Anything else (PENDING, SCA_COMPLETE, unknown): the payer has initiated/approved, so
      //   settlement may be in flight — refuse, and let verify/webhook/TTL keep tracking it.
      if (mappedStatus === BankTransferStatus.PENDING && !isRowExpired(row)) {
        if (lastKnownStatus === 'DRAFT') {
          await this.cancelBlikkPayment(row.providerPaymentId, logPrefix)
        } else if (lastKnownStatus !== 'SCA_REQUIRED') {
          this.logger.warn(
            `${logPrefix}Cancel refused — payment may be settling`,
            { lastKnownStatus },
          )
          throw new BadRequestException(
            BankTransferErrorCode.BankTransferAlreadyInProgress,
          )
        }
      }
    }

    const [affectedRows] = await this.bankTransferPaymentModel.update(
      { isDeleted: true },
      {
        where: {
          id: row.id,
          isDeleted: false,
          lastKnownStatus,
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

    // Only active-PENDING cancels emit `payment_cancelled`.
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
    let refreshed: BankTransferPaymentResult | null = null

    // PENDING → ask Blikk for the authoritative state.
    if (mapped === BankTransferStatus.PENDING) {
      refreshed = await this.refreshFromBlikkOrWarn(row)

      if (refreshed) {
        await this.finalizeFromBlikkResult(row, refreshed)

        if (refreshed.status === BankTransferStatus.SUCCESS) {
          // finalizeFromBlikkResult just created the fulfillment — report PAID rather than null so
          // the controller doesn't fold in a stale pre-finalize UNPAID snapshot.
          return this.paidBankTransferOverlay(paymentFlowId)
        }

        if (isBankTransferFailureStatus(refreshed.status)) {
          return {
            paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
            updatedAt: row.modified,
            lastBankTransferFailure:
              deriveBankTransferFailureReason(refreshed.status, row) ??
              undefined,
          }
        }

        mapped = mapBlikkStatusToBankTransferStatus(refreshed.rawStatus)
      }
    }

    if (mapped === BankTransferStatus.SUCCESS) {
      // Reaching here means the flow is UNPAID (controller gate) yet the row is SUCCESS — a settled
      // transfer whose fulfillment never committed. Repair it (idempotent), then report PAID.
      await this.finalizeBankTransferSuccess({
        correlationId: row.id,
        paymentFlowId: row.paymentFlowId,
        providerPaymentId: row.providerPaymentId,
        rawStatus: row.lastKnownStatus,
      }).catch((error) => {
        this.logger.warn(
          `[${row.paymentFlowId}] Failed to repair settled bank transfer during status read`,
          { error: (error as Error)?.message },
        )
      })
      return this.paidBankTransferOverlay(paymentFlowId)
    }

    // Still PENDING (or Blikk unreachable) and past TTL → abandoned; discard so the flow returns to
    // UNPAID. The Blikk refresh above is what guards against discarding a settled-but-uncallbacked row.
    if (isExpired) {
      void this.softDeleteRow(row.id).catch((error) => {
        this.logger.warn(
          `[${row.paymentFlowId}] Failed to soft-delete expired bank transfer row`,
          { error: (error as Error)?.message },
        )
      })
      return null
    }

    if (mapped === BankTransferStatus.PENDING) {
      // Prefer the just-refreshed URL — the in-memory row predates any persist above.
      const scaRedirectUrl =
        refreshed?.scaRedirectUrl ?? row.scaRedirectUrl ?? undefined
      return {
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        updatedAt: row.modified,
        bankTransferScaRedirectUrl: scaRedirectUrl,
        bankTransferExpiresAt: row.expiresAt,
        bankTransferPendingStatus: mapRawStatusToBankTransferPendingStatus(
          refreshed?.rawStatus ?? row.lastKnownStatus,
          scaRedirectUrl,
        ),
      }
    }

    return {
      paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
      updatedAt: row.modified,
      lastBankTransferFailure:
        deriveBankTransferFailureReason(mapped, row) ?? undefined,
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
    // Blikk gives us no settlement timestamp, so the moment we record SUCCESS is our best
    // proxy for when the bank transfer was paid (sent to FJS as the charge's effective date).
    const chargePayload = await this.buildFjsChargePayload(
      paymentFlowId,
      providerPaymentId,
      correlationId,
      new Date(),
    )

    // Create the fulfillment BEFORE marking the row SUCCESS so that a SUCCESS `lastKnownStatus`
    // always implies a committed fulfillment. If this throws the row stays in its prior state and
    // the next verify/status read retries — never leaving a settled-but-unpaid flow stuck.
    await this.createBankTransferFulfillment(
      paymentFlowId,
      correlationId,
      chargePayload,
    )

    // Record SUCCESS only once. The `lastKnownStatus` guard makes the transition (and the
    // payment_completed event below) fire exactly once even when finalizers race or repair runs.
    const [affectedRows] = await this.bankTransferPaymentModel.update(
      { lastKnownStatus: rawStatus },
      {
        where: {
          id: correlationId,
          paymentFlowId,
          isDeleted: false,
          lastKnownStatus: { [Op.ne]: rawStatus },
        },
      },
    )

    if (affectedRows === 0) {
      return
    }

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

    // Fulfillment and FJS charge already exist — skip.
    if (existing?.fjsChargeId) {
      return
    }

    // Fulfillment does not exist — create it.
    if (!existing) {
      try {
        await this.paymentFulfillmentModel.create({
          paymentFlowId,
          paymentMethod: 'bank_transfer',
          confirmationRefId,
        })
      } catch (error) {
        if ((error as Error)?.name !== 'SequelizeUniqueConstraintError') {
          throw error
        }
      }
    }

    this.logger.info(`[${paymentFlowId}] Creating bank transfer FJS charge`, {
      confirmationRefId,
      paymentMeans: chargePayload.payInfo?.paymentMeans,
      rrn: chargePayload.payInfo?.RRN,
      payableAmount: chargePayload.payInfo?.payableAmount,
    })

    // A fulfillment without an FJS charge must re-attempt the charge; createFjsCharge is idempotent.
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
      // Fulfillment is committed; we don't un-pay. The payment worker reconciles fulfillments
      // that lack an FJS charge, so this inline failure is retried automatically — not critical.
      this.logger.warn(
        `[${paymentFlowId}] Bank transfer settled but inline FJS charge failed after retries — the payment worker will retry`,
        {
          errorName: (error as Error)?.name,
          error: (error as Error)?.message,
          stack: (error as Error)?.stack,
        },
      )
    }
  }

  async createBankTransferPayment(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    const body: CreateBlikkPaymentRequest = {
      amount: input.amount,
      currency: input.currency,
      sourceReferenceId: input.correlationId,
      callbackUrl: input.callbackUrl,
      partnerRedirectUrl: input.partnerRedirectUrl,
      expiresAt: input.expiresAt,
      items: input.items?.map(toBlikkItem),
      debtorExternalId: input.debtorExternalId,
      // Blikk expects a debtor name; we send the national id.
      debtorName: input.debtorExternalId,
      debtorBban: input.bankAccountNumber,
    }

    try {
      return this.toResult(await this.blikkClient.createPayment(body))
    } catch (e) {
      if (e instanceof BlikkClientError) {
        throw new BadRequestException(
          BankTransferErrorCode.FailedToCreateBankTransfer,
        )
      }
      throw e
    }
  }

  async getPayment(
    providerPaymentId: string,
  ): Promise<BankTransferPaymentResult> {
    try {
      return this.toResult(await this.blikkClient.getPayment(providerPaymentId))
    } catch (e) {
      if (e instanceof BlikkClientError) {
        throw new BadRequestException(
          BankTransferErrorCode.FailedToFetchBankTransfer,
        )
      }
      throw e
    }
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

  /**
   * Soft-deletes the active row for a refund and returns its id (or null if none) so the saga can
   * restore it on rollback. Deleting the row is what stops a post-refund `verify` (poll, webhook, or
   * the anonymous mutation) from re-running `finalizeBankTransferSuccess` and resurrecting the
   * fulfillment + FJS charge the refund just removed — and lets the flow be re-paid by bank transfer.
   */
  async softDeleteRowForRefund(paymentFlowId: string): Promise<string | null> {
    const row = await this.bankTransferPaymentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    if (!row) {
      return null
    }

    await this.softDeleteRow(row.id)
    return row.id
  }

  /** Restores a row soft-deleted by {@link softDeleteRowForRefund}; idempotent. Used on refund rollback. */
  async restoreRow(rowId: string): Promise<void> {
    await this.bankTransferPaymentModel.update(
      { isDeleted: false },
      { where: { id: rowId, isDeleted: true } },
    )
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  /**
   * Builds the PAID overlay for a settled bank transfer from the committed fulfillment. Returns null
   * if no fulfillment exists yet (settlement could not be finalized), so the flow stays UNPAID rather
   * than falsely reporting PAID without a charge.
   */
  private async paidBankTransferOverlay(
    paymentFlowId: string,
  ): Promise<BankTransferStatusOverlay | null> {
    const fulfillment = await this.paymentFulfillmentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    if (!fulfillment) {
      return null
    }

    return {
      paymentStatus: PaymentStatus.PAID,
      updatedAt: fulfillment.created,
    }
  }

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

  /**
   * Used to finalize the bank transfer after a refresh from Blikk.
   */
  private async finalizeFromBlikkResult(
    row: BankTransferPayment,
    refreshed: BankTransferPaymentResult,
  ): Promise<void> {
    // On SUCCESS, finalize the bank transfer.
    if (refreshed.status === BankTransferStatus.SUCCESS) {
      await this.finalizeBankTransferSuccess({
        correlationId: row.id,
        paymentFlowId: row.paymentFlowId,
        providerPaymentId: row.providerPaymentId,
        rawStatus: refreshed.rawStatus,
      })
      // On failure, finalize the bank transfer failure.
    } else if (isBankTransferFailureStatus(refreshed.status)) {
      await this.finalizeBankTransferFailure(row, refreshed)
      // On PENDING with raw-status drift (or a newly minted SCA URL), update the row.
    } else if (
      refreshed.rawStatus !== row.lastKnownStatus ||
      (refreshed.scaRedirectUrl && !row.scaRedirectUrl)
    ) {
      await this.bankTransferPaymentModel.update(
        {
          lastKnownStatus: refreshed.rawStatus,
          ...(refreshed.scaRedirectUrl && !row.scaRedirectUrl
            ? { scaRedirectUrl: refreshed.scaRedirectUrl }
            : {}),
        },
        {
          where: {
            id: row.id,
            isDeleted: false,
            lastKnownStatus: row.lastKnownStatus,
          },
        },
      )
    }
  }

  /** Race-guarded persist of a terminal failure + payment_failed event (only the race winner fires). */
  private async finalizeBankTransferFailure(
    row: BankTransferPayment,
    result: BankTransferPaymentResult,
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

  /**
   * Best-effort Blikk cancel — only ever called for a DRAFT payment (Blikk cancels DRAFT only,
   * and past-DRAFT statuses are handled in `cancel` before this point). A DRAFT cannot settle,
   * so any failure here (404 gone, refused, network) is safe to swallow: the payment simply
   * lapses via the TTL we sent Blikk on create.
   */
  private async cancelBlikkPayment(
    providerPaymentId: string,
    logPrefix: string,
  ): Promise<void> {
    try {
      await this.blikkClient.cancelPayment(providerPaymentId)
    } catch (e) {
      this.logger.warn(
        `${logPrefix}Best-effort Blikk cancel failed — payment lapses via its TTL`,
        {
          providerPaymentId,
          status: e instanceof BlikkClientError ? e.status : undefined,
        },
      )
    }
  }

  /** Builds the FJS charge payload for a settled bank transfer. */
  private async buildFjsChargePayload(
    paymentFlowId: string,
    providerPaymentId: string,
    correlationId: string,
    settledAt: Date,
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
      correlationId,
      effectiveDate: settledAt,
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
      onboardingRequired: isOnboardingRequired(
        data.status,
        data.scaRedirectUrl || undefined,
      ),
    }
  }
}
