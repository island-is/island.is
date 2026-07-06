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
import type { BankTransferPayment } from '../bankTransferPayment/models/bankTransferPayment.model'
import { generateCardChargeFJSPayload } from '../cardPayment/cardPayment.utils'
import type { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import type { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlow } from '../paymentFlow/models/paymentFlow.model'
import type { PaymentWorkerEventAttributes } from '../paymentFlow/models/paymentWorkerEvent.model'
import { PaymentWorkerEvent } from '../paymentFlow/models/paymentWorkerEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { WorkerModuleConfig } from './worker.config'
import { WorkerTaskType } from './workerTaskTypes'

/** Flow with associations preloaded (from findPaidFlowsWithoutFjsCharge). */
type PaymentFlowWithWorkerEvents = InferAttributes<PaymentFlow> & {
  workerEvents?: PaymentWorkerEventAttributes[]
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
    const paymentFlowsToProcess = allFlows.filter((flow) => {
      const shouldSkip = this.shouldSkipDueToFailureCount(
        flow.workerEvents ?? [],
        this.workerConfig.workerMaxFailureEventsPerFlow,
      )

      if (shouldSkip) {
        const failureCount = (flow.workerEvents ?? []).filter(
          (e) => e.status === 'failure',
        ).length
        this.logger.warn(
          `[${flow.id}] Skipping payment flow — exceeded max failure attempts (failures: ${failureCount}, limit: ${this.workerConfig.workerMaxFailureEventsPerFlow}). Manual intervention required.`,
        )
      }

      return !shouldSkip
    })

    const skippedCount = allFlows.length - paymentFlowsToProcess.length

    let createdFJSCharges = 0
    let failedCount = 0

    // Step 3: Process each flow individually
    for (const paymentFlow of paymentFlowsToProcess) {
      try {
        const createdFjsCharge = await this.createFjsChargeForPaymentFlow(
          paymentFlow,
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
  ): Promise<{ receptionId: string }> {
    const fulfillment = this.getActiveFulfillment(
      paymentFlow.paymentFulfillments as InferAttributes<PaymentFulfillment>[],
    )

    const chargePayload =
      fulfillment.paymentMethod === 'bank_transfer'
        ? await this.buildBankTransferChargePayload(paymentFlow, fulfillment)
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

  /** Builds the unpaid card FJS charge payload from the flow's latest card payment details. */
  private async buildCardChargePayload(
    paymentFlow: PaymentFlowWithWorkerEvents,
  ): Promise<Charge> {
    const cardPaymentDetails = this.getLatestCardPaymentDetails(
      paymentFlow.cardPaymentDetails as InferAttributes<CardPaymentDetails>[],
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

  /** Builds the PAID bank-transfer FJS charge payload for a settled-but-uncharged fulfillment. */
  private async buildBankTransferChargePayload(
    paymentFlow: PaymentFlowWithWorkerEvents,
    fulfillment: InferAttributes<PaymentFulfillment>,
  ): Promise<Charge> {
    // The fulfillment's confirmationRefId is the bank_transfer_payment row id (== FJS correlationId).
    const bankTransferPayment = (
      paymentFlow.bankTransferPayments as InferAttributes<BankTransferPayment>[]
    )?.find((row) => row.id === fulfillment.confirmationRefId)

    if (!bankTransferPayment) {
      throw new BadRequestException(
        'No bank transfer payment found for payment flow fulfillment',
      )
    }

    const { catalogItems, totalPrice } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges as ChargeItem[],
      )

    return generateBankTransferChargeFJSPayload({
      paymentFlow,
      charges: catalogItems,
      totalPrice,
      systemId: environment.chargeFjs.systemId,
      providerPaymentId: bankTransferPayment.providerPaymentId,
      correlationId: fulfillment.confirmationRefId,
      // The fulfillment row is created at settlement — its `created` is the payment-completion date.
      effectiveDate: new Date(fulfillment.created),
    })
  }

  private async findPaymentFlowsToProcess(): Promise<
    PaymentFlowWithWorkerEvents[]
  > {
    const cutoffTime = new Date()
    cutoffTime.setMinutes(
      cutoffTime.getMinutes() -
        this.workerConfig.workerMinutesToWaitBeforeCreatingFjsCharge,
    )

    return this.paymentFlowService.findPaidFlowsWithoutFjsCharge(
      cutoffTime,
    ) as Promise<PaymentFlowWithWorkerEvents[]>
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
    fulfillments: InferAttributes<PaymentFulfillment>[],
  ): InferAttributes<PaymentFulfillment> {
    // The db query filters to one non-deleted, unpaid fulfillment per flow.
    if (!fulfillments || fulfillments.length === 0) {
      throw new BadRequestException('No fulfillment found for payment flow')
    }
    return fulfillments[0]
  }

  private getLatestCardPaymentDetails(
    details: InferAttributes<CardPaymentDetails>[],
  ): InferAttributes<CardPaymentDetails> {
    // should not happen because card payment details are required in the db query
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
