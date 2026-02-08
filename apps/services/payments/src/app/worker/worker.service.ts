import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import type { InferAttributes } from 'sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FjsErrorCode } from '@island.is/shared/constants'
import { retry } from '@island.is/shared/utils/server'

import { environment } from '../../environments'
import { ChargeItem } from '../../utils/chargeUtils'
import { generateCardChargeFJSPayload } from '../cardPayment/cardPayment.utils'
import type { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { PaymentFlow } from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
const MINUTES_TO_WAIT_BEFORE_CREATING_FJS_CHARGE = 5

/**
 * Worker service that creates FJS charges for payment flows paid with card payments.
 */
@Injectable()
export class WorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly paymentFlowService: PaymentFlowService,
  ) {}

  /**
   * Main entry point: finds paid flows without FJS charges and creates them.
   */
  public async run() {
    const timer = this.logger.startTimer()

    // Step 1: Find all payment flows that are paid (have fulfillment) but missing FJS charge
    const paymentFlowsToProcess = await this.findPaymentFlowsToProcess()
    let createdFJSCharges = 0

    // Step 2: Process each flow individually
    for (const paymentFlow of paymentFlowsToProcess) {
      try {
        await this.createFjsChargeForPaymentFlow(paymentFlow)
        createdFJSCharges++
      } catch (error) {
        this.logger.error(
          `[${paymentFlow.id}] Failed to create FJS charge for paid payment flow`,
          { error: error?.message, stack: error?.stack },
        )
      }
    }

    if (createdFJSCharges > 0) {
      this.logger.info(`Finished creating ${createdFJSCharges} FJS charges.`)
    } else {
      this.logger.info(`No card payments found to create FJS charges for.`)
    }

    timer.done()
  }

  private async findPaymentFlowsToProcess(): Promise<
    InferAttributes<PaymentFlow>[]
  > {
    const cutoffTime = new Date()
    cutoffTime.setMinutes(
      cutoffTime.getMinutes() - MINUTES_TO_WAIT_BEFORE_CREATING_FJS_CHARGE,
    )

    return this.paymentFlowService.findPaidFlowsWithoutFjsCharge(cutoffTime)
  }

  /**
   * Creates an FJS charge for a single payment flow.
   */
  private async createFjsChargeForPaymentFlow(
    paymentFlow: InferAttributes<PaymentFlow>,
  ): Promise<void> {
    const cardPaymentDetails = this.getLatestCardPaymentDetails(
      paymentFlow.cardPaymentDetails as InferAttributes<CardPaymentDetails>[],
    )

    const { catalogItems } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges as ChargeItem[],
      )

    const chargePayload = generateCardChargeFJSPayload({
      paymentFlow,
      charges: catalogItems,
      chargeResponse: {
        acquirerReferenceNumber: cardPaymentDetails.acquirerReferenceNumber,
        authorizationCode: cardPaymentDetails.authorizationCode,
        cardScheme: cardPaymentDetails.cardScheme,
        maskedCardNumber: cardPaymentDetails.maskedCardNumber,
        cardUsage: cardPaymentDetails.cardUsage,
      },
      totalPrice: cardPaymentDetails.totalPrice,
      systemId: environment.chargeFjs.systemId,
      merchantReferenceData: cardPaymentDetails.merchantReferenceData,
    })

    await retry(
      () =>
        this.paymentFlowService.createFjsCharge(paymentFlow.id, chargePayload),
      {
        maxRetries: 3,
        retryDelayMs: 1000,
        logger: this.logger,
        logPrefix: `[${paymentFlow.id}] Create FJS Payment Charge`,
        shouldRetryOnError: (error) => {
          return error.message !== FjsErrorCode.AlreadyCreatedCharge
        },
      },
    )

    this.logger.info(`[${paymentFlow.id}] Successfully created FJS charge`)
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
