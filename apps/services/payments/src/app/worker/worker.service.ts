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
import { environment } from '../../environments'
import { ChargeItem } from '../../utils/chargeUtils'
import { generateBankTransferChargeFJSPayload } from '../bankTransferPayment/bankTransfer.utils'
import { generateCardChargeFJSPayload } from '../cardPayment/cardPayment.utils'
import type { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import type { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlow } from '../paymentFlow/models/paymentFlow.model'
import type { PaymentWorkerEventAttributes } from '../paymentFlow/models/paymentWorkerEvent.model'
import { PaymentWorkerEvent } from '../paymentFlow/models/paymentWorkerEvent.model'
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
 * Worker service that creates FJS charges for payment flows paid with card or bank transfer.
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
  ) {}

  /**
   * Main entry point: finds paid flows without FJS charges and creates them.
   */
  public async run() {
    const timer = this.logger.startTimer()

    // Step 1: Find all payment flows that are paid (have fulfillment) but missing FJS charge
    const allFlows = await this.findPaymentFlowsToProcess()
    this.logger.info(
      `Found ${allFlows.length} payment flow(s) pending FJS charge`,
    )

    // Step 2: Filter out flows that have reached the failure limit (manual intervention required)
    const skippedFlowIds: string[] = []
    const paymentFlowsToProcess = allFlows.filter(({ flow }) => {
      const shouldSkip = this.shouldSkipDueToFailureCount(
        flow.workerEvents ?? [],
        this.workerConfig.workerMaxFailureEventsPerFlow,
      )

      if (shouldSkip) {
        skippedFlowIds.push(flow.id)
      }

      return !shouldSkip
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

    const skippedCount = skippedFlowIds.length

    let createdFJSCharges = 0
    let failedCount = 0

    // Step 3: Process each flow individually
    for (const { flow: paymentFlow, paymentMethod } of paymentFlowsToProcess) {
      try {
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
      `Payment worker run complete — created: ${createdFJSCharges}, failed: ${failedCount}, skipped (manual intervention): ${skippedCount}`,
    )

    timer.done()
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
      this.logger.warn(
        `[${paymentFlow.id}] Catalog total (${catalogTotalPrice}) differs from settled bank transfer amount (${bankTransferPayment.amount}) — charging the settled amount`,
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
    // The db query left-joins card details (bank-transfer flows have none), so a card
    // flow can reach here with zero rows — e.g. all its details soft-deleted.
    if (!details || details.length === 0) {
      throw new BadRequestException(
        'No card payment details found for payment flow (possible interrupted refund — card confirmation deleted while fulfillment is active)',
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
