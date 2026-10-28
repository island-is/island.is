import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import type { InferAttributes } from 'sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FjsErrorCode } from '@island.is/shared/constants'
import { retry } from '@island.is/shared/utils/server'

import { Charge } from '@island.is/clients/charge-fjs-v2'

import { FJS_NETWORK_ERROR } from '../../utils/fjsCharge'
import type { FjsPayInfo } from '../../utils/fjsDebtPayment'
import { PaymentMethod } from '../../types'
import { environment } from '../../environments'
import { ChargeItem } from '../../utils/chargeUtils'
import {
  bankTransferLogContext,
  getBankTransferPayerType,
  buildBankTransferPayInfo,
  generateBankTransferChargeFJSPayload,
} from '../bankTransferPayment/bankTransfer.utils'
import {
  buildCardPayInfo,
  generateCardChargeFJSPayload,
} from '../cardPayment/cardPayment.utils'
import { DebtSettlementService } from '../debtPayment/debtSettlement.service'
import { RefundOrchestrationService } from '../refund/refundOrchestration.service'
import {
  PaymentFlow,
  PaymentWorkerEvent,
  type CardPaymentDetails,
  type PaymentFulfillment,
  type PaymentWorkerEventAttributes,
} from '../paymentFlow/models'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { WorkerModuleConfig } from './worker.config'
import { WorkerTaskType } from './workerTaskTypes'

/** Flow with associations preloaded. */
type PaymentFlowWithWorkerEvents = InferAttributes<PaymentFlow> & {
  workerEvents?: PaymentWorkerEventAttributes[]
}

/** Flow tagged with the payment method whose sweep returned it. */
type FlowToProcess = {
  flow: PaymentFlowWithWorkerEvents
  paymentMethod: 'card' | 'bank_transfer'
}

/**
 * Worker service that creates FJS charges for payment flows paid with card or bank transfer, and
 * registers paid debt flows with FJS.
 */
@Injectable()
export class WorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly paymentFlowService: PaymentFlowService,
    @InjectModel(PaymentWorkerEvent)
    private readonly paymentWorkerEventModel: typeof PaymentWorkerEvent,
    @Inject(WorkerModuleConfig.KEY)
    private readonly workerConfig: ConfigType<typeof WorkerModuleConfig>,
    private readonly debtSettlementService: DebtSettlementService,
    private readonly refundOrchestrationService: RefundOrchestrationService,
  ) {}

  /**
   * Main entry point: creates the FJS charges of paid charge flows, then registers paid debt flows
   * with FJS. The two passes are independent, so one failing does not stop the other. The job
   * still fails afterwards, with the first error.
   */
  public async run() {
    const timer = this.logger.startTimer()
    const errors: unknown[] = []

    for (const [name, pass] of [
      ['FJS charge', () => this.createFjsCharges()],
      ['Debt payment', () => this.settleDebtFlows()],
    ] as const) {
      try {
        await pass()
      } catch (error) {
        errors.push(error)
        this.logger.error(`${name} pass failed`, {
          error: (error as Error)?.message,
          stack: (error as Error)?.stack,
        })
      }
    }

    timer.done()

    if (errors.length > 0) {
      throw errors[0]
    }
  }

  /** Finds paid flows without FJS charges and creates them. */
  private async createFjsCharges() {
    // Step 1: Find all payment flows that are paid (have fulfillment) but missing FJS charge
    const allFlows = await this.findPaymentFlowsToProcess()
    this.logger.info(
      `Found ${allFlows.length} payment flow(s) pending FJS charge`,
    )

    // Step 2: Filter out flows that have reached the failure limit (manual intervention required)
    // and flows whose last failure is too recent to retry yet.
    const skippedFlowIds: string[] = []
    const deferredFlowIds: string[] = []
    const now = new Date()
    const paymentFlowsToProcess = allFlows.filter(({ flow }) => {
      const events = flow.workerEvents ?? []

      if (
        this.shouldSkipDueToFailureCount(
          events,
          this.workerConfig.workerMaxFailureEventsPerFlow,
        )
      ) {
        skippedFlowIds.push(flow.id)
        return false
      }

      if (
        this.shouldDeferDueToRecentFailure(
          events,
          this.workerConfig.workerRetryDelayMinutesAfterFailure,
          now,
        )
      ) {
        deferredFlowIds.push(flow.id)
        return false
      }

      return true
    })

    // One aggregate line per run — ops alerting keys on the capped failure events
    // (self-limiting at the failure limit per flow), not on this recurring log.
    if (skippedFlowIds.length > 0) {
      this.logger.info(
        `Skipping ${
          skippedFlowIds.length
        } payment flow(s) that exceeded the failure limit (${
          this.workerConfig.workerMaxFailureEventsPerFlow
        }) and require manual intervention: ${skippedFlowIds.join(', ')}`,
      )
    }

    if (deferredFlowIds.length > 0) {
      this.logger.info(
        `Deferring ${
          deferredFlowIds.length
        } payment flow(s) that failed less than ${
          this.workerConfig.workerRetryDelayMinutesAfterFailure
        } minute(s) ago: ${deferredFlowIds.join(', ')}`,
      )
    }

    const skippedCount = skippedFlowIds.length
    const deferredCount = deferredFlowIds.length

    let createdFJSCharges = 0
    let failedCount = 0

    // Step 3: Process each flow individually
    for (const { flow: paymentFlow, paymentMethod } of paymentFlowsToProcess) {
      try {
        // Creating a charge would make the payer owe for a payment that was refunded, see
        // finishRefundedRollback
        if (paymentMethod === 'card') {
          const { confirmationRefId } = this.getActiveFulfillment(paymentFlow)
          if (
            await this.paymentFlowService.isCardPaymentRefunded(
              paymentFlow.id,
              confirmationRefId,
            )
          ) {
            await this.finishRefundedRollback(
              paymentFlow.id,
              confirmationRefId,
              WorkerTaskType.CreateFjsCharge,
            )
            continue
          }
        }

        const createdFjsCharge = await this.createFjsChargeForPaymentFlow(
          paymentFlow,
          paymentMethod,
        )

        await this.recordWorkerEvent(
          paymentFlow.id,
          WorkerTaskType.CreateFjsCharge,
          'success',
          {
            metadata: {
              receptionId: createdFjsCharge?.receptionId,
            },
          },
        )
        createdFJSCharges++
      } catch (error) {
        const err = error as { message?: string } & Error
        const msg = err?.message
        failedCount++

        if (msg === FJS_NETWORK_ERROR) {
          this.logger.warn(
            `[${paymentFlow.id}] FJS request failed (network/transient), will retry`,
          )
        } else {
          await this.recordWorkerEvent(
            paymentFlow.id,
            WorkerTaskType.CreateFjsCharge,
            'failure',
            {
              errorCode: msg,
              message: err?.message,
              metadata: { stack: err?.stack },
            },
          )

          if (msg === FjsErrorCode.AlreadyCreatedCharge) {
            this.logger.warn(
              `[${paymentFlow.id}] FJS charge already exists, flow/fulfillment not updated — manual reconciliation required`,
            )
          } else {
            this.logger.error(
              `[${paymentFlow.id}] Failed to create FJS charge for paid payment flow`,
              { error: err?.message, stack: err?.stack },
            )
          }
        }
      }
    }

    this.logger.info(
      `Payment worker run complete — created: ${createdFJSCharges}, failed: ${failedCount}, skipped (manual intervention): ${skippedCount}, deferred (retry delay): ${deferredCount}`,
    )
  }

  /**
   * Registers paid debt flows with FJS (`payDebt`) that the payment flow could not finish inline.
   * A payment FJS rejects is undone: card payments are refunded, bank transfers are left for a
   * manual refund.
   */
  private async settleDebtFlows() {
    const cutoffTime = new Date()
    cutoffTime.setMinutes(
      cutoffTime.getMinutes() -
        this.workerConfig.workerMinutesToWaitBeforeSettlingDebt,
    )

    const debtFlows = (await this.paymentFlowService.findDebtFlowsToSettle(
      cutoffTime,
    )) as PaymentFlowWithWorkerEvents[]
    this.logger.info(
      `Found ${debtFlows.length} debt payment flow(s) pending FJS registration`,
    )

    let settledCount = 0
    let failedCount = 0
    const skippedFlowIds: string[] = []
    const deferredFlowIds: string[] = []
    const now = new Date()

    for (const paymentFlow of debtFlows) {
      const events = paymentFlow.workerEvents ?? []

      if (
        this.shouldSkipDueToFailureCount(
          events,
          this.workerConfig.workerMaxFailureEventsPerFlow,
        )
      ) {
        skippedFlowIds.push(paymentFlow.id)
        continue
      }

      if (
        this.shouldDeferDueToRecentFailure(
          events,
          this.workerConfig.workerRetryDelayMinutesAfterFailure,
          now,
        )
      ) {
        deferredFlowIds.push(paymentFlow.id)
        continue
      }

      try {
        const settled = await this.settleDebtFlow(paymentFlow)
        settled ? settledCount++ : failedCount++
      } catch (error) {
        const err = error as Error
        failedCount++

        await this.recordWorkerEvent(
          paymentFlow.id,
          WorkerTaskType.PayFjsDebt,
          'failure',
          {
            errorCode: err?.message,
            message: err?.message,
            metadata: { stack: err?.stack },
          },
        )
        this.logger.error(
          `[${paymentFlow.id}] Failed to settle debt payment flow`,
          { error: err?.message, stack: err?.stack },
        )
      }
    }

    // Like for charges, ops alerting keys on the capped failure events, not on this recurring line.
    if (skippedFlowIds.length > 0) {
      this.logger.warn(
        `Skipping ${
          skippedFlowIds.length
        } debt payment flow(s) that exceeded the failure limit (${
          this.workerConfig.workerMaxFailureEventsPerFlow
        }) and require manual intervention: ${skippedFlowIds.join(', ')}`,
      )
    }

    if (deferredFlowIds.length > 0) {
      this.logger.info(
        `Deferring ${
          deferredFlowIds.length
        } debt payment flow(s) that failed less than ${
          this.workerConfig.workerRetryDelayMinutesAfterFailure
        } minute(s) ago: ${deferredFlowIds.join(', ')}`,
      )
    }

    this.logger.info(
      `Debt payment run complete — settled: ${settledCount}, failed: ${failedCount}, skipped (manual intervention): ${skippedFlowIds.length}, deferred (retry delay): ${deferredFlowIds.length}`,
    )
  }

  /** @returns false when the flow is left for the next run */
  private async settleDebtFlow(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): Promise<boolean> {
    const fulfillment = this.getActiveFulfillment(paymentFlow)
    const paymentMethod =
      fulfillment.paymentMethod === 'bank_transfer'
        ? PaymentMethod.BANK_TRANSFER
        : PaymentMethod.CARD

    // The payment saga refunded the card but did not finish its rollback, see
    // finishRefundedRollback: registering the payment would make the payer owe for money they
    // got back, and refunding it again would pay them twice.
    if (
      paymentMethod === PaymentMethod.CARD &&
      (await this.paymentFlowService.isCardPaymentRefunded(
        paymentFlow.id,
        fulfillment.confirmationRefId,
      ))
    ) {
      await this.finishRefundedRollback(
        paymentFlow.id,
        fulfillment.confirmationRefId,
        WorkerTaskType.PayFjsDebt,
      )
      return true
    }

    // FJS rejected the payment earlier but the card refund did not go through, only the refund
    // is left to do.
    if (paymentFlow.debtSettlement?.status === 'rejected') {
      await this.refundRejectedDebtPayment(paymentFlow.id)
      await this.recordWorkerEvent(
        paymentFlow.id,
        WorkerTaskType.PayFjsDebt,
        'success',
        { metadata: { refundedRejectedPayment: true } },
      )
      return true
    }

    // The flows were read at the start of the run, and a refund since then deletes the
    // fulfillment. Registering a refunded payment can not be undone, FJS has no reversal.
    const currentFulfillment =
      await this.paymentFlowService.findPaymentFulfillmentForPaymentFlow(
        paymentFlow.id,
      )
    if (
      currentFulfillment?.confirmationRefId !== fulfillment.confirmationRefId
    ) {
      this.logger.warn(
        `[${paymentFlow.id}] Debt payment no longer paid (refunded during the run), not registering it`,
      )
      return false
    }

    const payInfo =
      paymentMethod === PaymentMethod.BANK_TRANSFER
        ? this.buildBankTransferPayInfo(paymentFlow)
        : this.buildCardPayInfo(paymentFlow)

    const outcome = await this.debtSettlementService.attempt(
      {
        id: paymentFlow.id,
        payerNationalId: paymentFlow.payerNationalId,
        debts: paymentFlow.debts,
      },
      payInfo,
    )

    switch (outcome.type) {
      case 'registered':
        if (!outcome.alreadySettled) {
          await this.paymentFlowService.logDebtPaymentFinalized(
            paymentFlow.id,
            paymentMethod,
            outcome,
          )
        }
        await this.recordWorkerEvent(
          paymentFlow.id,
          WorkerTaskType.PayFjsDebt,
          'success',
          {
            metadata: {
              dateCreated: outcome.dateCreated,
            },
          },
        )
        return true

      case 'rejected':
        await this.handleRejectedDebtPayment(
          paymentFlow.id,
          paymentMethod,
          outcome.problem,
          outcome.alreadySettled,
        )
        await this.recordWorkerEvent(
          paymentFlow.id,
          WorkerTaskType.PayFjsDebt,
          'success',
          { metadata: { rejected: true, problem: outcome.problem } },
        )
        return true

      case 'reconcile':
        // The attempt wrote the durable event and raised the alert. Nothing is retried or refunded.
        await this.recordWorkerEvent(
          paymentFlow.id,
          WorkerTaskType.PayFjsDebt,
          'failure',
          {
            errorCode: 'needs_reconciliation',
            message: 'FJS rejected a debt payment after an unknown outcome',
            metadata: { problem: outcome.problem },
          },
        )
        return false

      case 'deferred':
        // Another attempt is running, FJS is busy with another payment for the debts, or FJS is
        // unreachable: like network errors on charges these are not counted as failures, the next
        // run tries again.
        if (outcome.reason === 'transient') {
          // FJS refused our credentials, it did not look at the payment.
          await this.recordWorkerEvent(
            paymentFlow.id,
            WorkerTaskType.PayFjsDebt,
            'failure',
            {
              errorCode: outcome.reason,
              message: 'FJS did not accept the debt payment call',
            },
          )
        } else {
          this.logger.warn(
            `[${paymentFlow.id}] Debt payment not registered yet (${outcome.reason}), will retry`,
          )
        }
        return false
    }
  }

  /**
   * FJS rejected the payment: let the organisation know, then give the money back. Bank
   * transfers can not be refunded automatically, Blikk refunds need an SCA approval.
   */
  private async handleRejectedDebtPayment(
    paymentFlowId: string,
    paymentMethod: PaymentMethod,
    problem: object | undefined,
    alreadyReported: boolean,
  ) {
    const isBankTransfer = paymentMethod === PaymentMethod.BANK_TRANSFER

    if (!alreadyReported) {
      if (isBankTransfer) {
        this.logger.error(
          `[${paymentFlowId}] FJS rejected a settled debt bank transfer — refund it manually`,
          { needsManualRefund: true, problem },
        )
      }

      await this.paymentFlowService.logDebtPaymentRejected(
        paymentFlowId,
        paymentMethod,
        problem,
        { needsManualRefund: isBankTransfer },
      )
    }

    if (!isBankTransfer) {
      await this.refundRejectedDebtPayment(paymentFlowId)
    }
  }

  /**
   * The payment saga refunds the card even when deleting the confirmation or fulfillment fails
   * while it rolls back, which leaves a refunded payment that still looks paid. The worker finishes
   * that rollback, and never refunds or charges it. A delete that fails again throws, and is
   * recorded as a failure like any other.
   */
  private async finishRefundedRollback(
    paymentFlowId: string,
    correlationId: string,
    taskType: string,
  ) {
    await this.paymentFlowService.deleteCardPaymentConfirmationAndFulfillment(
      paymentFlowId,
      correlationId,
    )
    this.logger.warn(
      `[${paymentFlowId}] Finished the rollback of a refunded card payment: confirmation and fulfillment deleted`,
    )
    await this.recordWorkerEvent(paymentFlowId, taskType, 'success', {
      metadata: { completedRollback: true },
    })
  }

  /** A system refund, the check that stops admins from refunding registered debts does not apply. */
  private async refundRejectedDebtPayment(paymentFlowId: string) {
    await this.refundOrchestrationService.refund(
      {
        paymentFlowId,
        reasonForRefund: 'FJS rejected the debt payment',
      },
      { system: true },
    )
  }

  /** The neutral payInfo of a settled card payment, same source as the FJS charge payload. */
  private buildCardPayInfo(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): FjsPayInfo {
    const cardPaymentDetails = this.getLatestCardPaymentDetails(
      paymentFlow.cardPaymentDetails,
    )

    return buildCardPayInfo({
      cardChargeInfo: {
        authorizationCode: cardPaymentDetails.authorizationCode,
        cardScheme: cardPaymentDetails.cardScheme,
        maskedCardNumber: cardPaymentDetails.maskedCardNumber,
        cardUsage: cardPaymentDetails.cardUsage,
      },
      totalPrice: cardPaymentDetails.totalPrice,
      merchantReferenceData: cardPaymentDetails.merchantReferenceData,
      // CardPaymentDetails.id is the per-attempt correlationId (see createCardPaymentConfirmation).
      correlationId: cardPaymentDetails.id,
    })
  }

  /** The neutral payInfo of a settled bank transfer, same source as the FJS charge payload. */
  private buildBankTransferPayInfo(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): FjsPayInfo {
    const fulfillment = this.getActiveFulfillment(paymentFlow)

    // The fulfillment's confirmationRefId is the bank_transfer_payment row id.
    const bankTransferPayment = paymentFlow.bankTransferPayments?.find(
      (row) => row.id === fulfillment.confirmationRefId,
    )

    if (!bankTransferPayment) {
      throw new BadRequestException(
        'No bank transfer payment found for payment flow fulfillment',
      )
    }

    return buildBankTransferPayInfo({
      providerPaymentId: bankTransferPayment.providerPaymentId,
      totalPrice: bankTransferPayment.amount,
      correlationId: fulfillment.confirmationRefId,
    })
  }

  /**
   * Creates an FJS charge for a single payment flow.
   * @returns The created FjsCharge (for recording success event with receptionId).
   */
  private async createFjsChargeForPaymentFlow(
    paymentFlow: PaymentFlowWithWorkerEvents,
    paymentMethod: 'card' | 'bank_transfer',
  ): Promise<{ receptionId: string }> {
    const chargePayload =
      paymentMethod === 'bank_transfer'
        ? await this.buildBankTransferChargePayload(paymentFlow)
        : await this.buildCardChargePayload(paymentFlow)

    const newCharge = await retry(
      () =>
        this.paymentFlowService.createFjsCharge(paymentFlow.id, chargePayload),
      {
        maxRetries: 3,
        retryDelayMs: 1000,
        logger: this.logger,
        logPrefix: `[${paymentFlow.id}] Create FJS Payment Charge`,
        shouldRetryOnError: (error) =>
          error.message !== FjsErrorCode.AlreadyCreatedCharge,
      },
    )

    this.logger.info(`[${paymentFlow.id}] Successfully created FJS charge`)
    return newCharge
  }

  /** Builds the FJS charge payload for a settled card payment — payInfo carries PAN, authCode, and card scheme. */
  private async buildCardChargePayload(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): Promise<Charge> {
    const cardPaymentDetails = this.getLatestCardPaymentDetails(
      paymentFlow.cardPaymentDetails,
    )

    const { catalogItems } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges as ChargeItem[],
      )

    return generateCardChargeFJSPayload({
      paymentFlow,
      charges: catalogItems,
      cardChargeInfo: {
        authorizationCode: cardPaymentDetails.authorizationCode,
        cardScheme: cardPaymentDetails.cardScheme,
        maskedCardNumber: cardPaymentDetails.maskedCardNumber,
        cardUsage: cardPaymentDetails.cardUsage,
      },
      totalPrice: cardPaymentDetails.totalPrice,
      systemId: environment.chargeFjs.systemId,
      merchantReferenceData: cardPaymentDetails.merchantReferenceData,
      // CardPaymentDetails.id is the per-attempt correlationId (see createCardPaymentConfirmation).
      correlationId: cardPaymentDetails.id,
      // The card confirmation row is created when the payment succeeds — its `created` is the
      // payment-completion date.
      effectiveDate: new Date(cardPaymentDetails.created),
    })
  }

  /** Builds the FJS charge payload for a settled bank transfer — payInfo carries the provider payment id (RRN) and Milli payment means. */
  private async buildBankTransferChargePayload(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): Promise<Charge> {
    const fulfillment = this.getActiveFulfillment(paymentFlow)

    // The fulfillment's confirmationRefId is the bank_transfer_payment row id (== FJS correlationId).
    const bankTransferPayment = paymentFlow.bankTransferPayments?.find(
      (row) => row.id === fulfillment.confirmationRefId,
    )

    if (!bankTransferPayment) {
      throw new BadRequestException(
        'No bank transfer payment found for payment flow fulfillment',
      )
    }

    const { catalogItems, totalPrice: catalogTotalPrice } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges as ChargeItem[],
      )

    // The charge is PAID — payInfo must carry the amount that actually settled, not the
    // catalog price at worker-run time (prices may have changed since settlement).
    if (catalogTotalPrice !== bankTransferPayment.amount) {
      // Amounts not logged: identifiers only. Both are recoverable from the row and catalog.
      this.logger.warn(
        `[${paymentFlow.id}] Catalog total differs from settled bank transfer amount — charging the settled amount`,
        bankTransferLogContext(
          paymentFlow.id,
          fulfillment.confirmationRefId,
          bankTransferPayment.providerPaymentId,
          getBankTransferPayerType(paymentFlow.payerNationalId),
          bankTransferPayment.bankCode,
        ),
      )
    }

    return generateBankTransferChargeFJSPayload({
      paymentFlow,
      charges: catalogItems,
      totalPrice: bankTransferPayment.amount,
      systemId: environment.chargeFjs.systemId,
      providerPaymentId: bankTransferPayment.providerPaymentId,
      correlationId: fulfillment.confirmationRefId,
      // The fulfillment row is created at settlement — its `created` is the payment-completion date.
      effectiveDate: new Date(fulfillment.created),
    })
  }

  private async findPaymentFlowsToProcess(): Promise<FlowToProcess[]> {
    const cutoffTime = new Date()
    cutoffTime.setMinutes(
      cutoffTime.getMinutes() -
        this.workerConfig.workerMinutesToWaitBeforeCreatingFjsCharge,
    )

    const [cardFlows, bankTransferFlows] = await Promise.all([
      this.paymentFlowService.findPaidFlowsWithoutFjsCharge(cutoffTime, 'card'),
      this.paymentFlowService.findPaidFlowsWithoutFjsCharge(
        cutoffTime,
        'bank_transfer',
      ),
    ])

    return [
      ...(cardFlows as PaymentFlowWithWorkerEvents[]).map((flow) => ({
        flow,
        paymentMethod: 'card' as const,
      })),
      ...(bankTransferFlows as PaymentFlowWithWorkerEvents[]).map((flow) => ({
        flow,
        paymentMethod: 'bank_transfer' as const,
      })),
    ]
  }

  /**
   * Returns true if this flow has at least `limit` failure events (skip flow, manual intervention required).
   */
  private shouldSkipDueToFailureCount(
    events: Array<{ status: string }>,
    limit: number,
  ): boolean {
    const failureCount = events.filter((e) => e.status === 'failure').length
    return failureCount >= limit
  }

  /**
   * Returns true if the flow's most recent failure event is less than `delayMinutes` old.
   * A flow that has never failed is processed right away; a failed flow waits out the delay
   * before the worker tries again (an FJS outage should not burn the failure limit in one go).
   */
  private shouldDeferDueToRecentFailure(
    events: Array<{ status: string; created: Date }>,
    delayMinutes: number,
    now: Date,
  ): boolean {
    const latestFailureAt = events
      .filter((e) => e.status === 'failure')
      .reduce<number | null>((latest, e) => {
        const createdAt = new Date(e.created).getTime()
        return latest === null || createdAt > latest ? createdAt : latest
      }, null)

    if (latestFailureAt === null) {
      return false
    }

    return now.getTime() - latestFailureAt < delayMinutes * 60 * 1000
  }

  /**
   * Records a worker event
   */
  private async recordWorkerEvent(
    paymentFlowId: string,
    taskType: string,
    status: 'success' | 'failure',
    options?: {
      errorCode?: string
      message?: string
      metadata?: object
    },
  ): Promise<void> {
    await this.paymentWorkerEventModel.create({
      paymentFlowId,
      taskType,
      status,
      errorCode: options?.errorCode ?? null,
      message: options?.message ?? null,
      metadata: options?.metadata ?? null,
    })
  }

  private getActiveFulfillment(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): InferAttributes<PaymentFulfillment> {
    const fulfillments = paymentFlow.paymentFulfillments ?? []

    // The db query filters to the method's non-deleted, unpaid fulfillments; the service
    // layer forbids paying twice for the same flow, so at most one is expected.
    if (fulfillments.length === 0) {
      throw new BadRequestException('No fulfillment found for payment flow')
    }
    return fulfillments[0]
  }

  private getLatestCardPaymentDetails(
    details?: InferAttributes<CardPaymentDetails>[],
  ): InferAttributes<CardPaymentDetails> {
    if (!details || details.length === 0) {
      throw new BadRequestException(
        'No card payment details found for payment flow',
      )
    }

    const sorted = [...details].sort(
      (a, b) =>
        new Date((b as { created?: Date }).created ?? 0).getTime() -
        new Date((a as { created?: Date }).created ?? 0).getTime(),
    )
    return sorted[0]
  }
}
