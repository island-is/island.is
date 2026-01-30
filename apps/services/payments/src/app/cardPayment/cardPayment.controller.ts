import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import {
  CardErrorCode,
  FjsErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { retry } from '@island.is/shared/utils/server'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentMethod, PaymentStatus } from '../../types'
import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { CardPaymentService } from './cardPayment.service'
import {
  ApplePaySessionResponse,
  ApplePayChargeResponse,
  ApplePayChargeInput,
  ChargeCardResponse,
  VerificationCallbackResponse,
  VerifyCardResponse,
  VerifyCardInput,
  VerificationCallbackInput,
  ChargeCardInput,
  GetVerificationStatus,
  VerificationStatusResponse,
} from './dtos'
import {
  CardPaymentResponse,
  PaymentTrackingData,
  RefundResponse,
} from '../../types/cardPayment'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { CatalogItemWithQuantity } from '../../types/charges'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { environment } from '../../environments'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments/card',
  version: ['1'],
})
export class CardPaymentController {
  constructor(
    private readonly cardPaymentService: CardPaymentService,
    private readonly paymentFlowService: PaymentFlowService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) { }

  @Post('/verify')
  @ApiOkResponse({
    type: VerifyCardResponse,
  })
  async verify(
    @Body() cardVerificationInput: VerifyCardInput,
  ): Promise<VerifyCardResponse> {
    const paymentFlowId = cardVerificationInput.paymentFlowId
    try {
      const canBePaid = await this.paymentFlowService.isEligibleToBePaid(
        paymentFlowId,
      )

      if (!canBePaid) {
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }

      const verification = await this.cardPaymentService.verify(
        cardVerificationInput,
      )

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_started',
        message: `Card verification started`,
      })

      // All required data to build the 3DS screen
      return { ...verification, correlationId: verification.correlationID }
    } catch (e) {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_failed',
        message: `Card verification was not started due to an error: ${e.message}`,
        metadata: {
          error: e.message,
        },
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(e.message, CardErrorCode.VerificationFailed),
      )
    }
  }

  @Post('/verify-callback')
  @ApiOkResponse({
    type: VerificationCallbackResponse,
  })
  async verificationCallback(
    @Body() cardVerificationCallbackInput: VerificationCallbackInput,
  ): Promise<VerificationCallbackResponse> {
    const mdPayload = this.cardPaymentService.getMdPayload(
      cardVerificationCallbackInput.md,
    )
    const { correlationId } = mdPayload

    const savedVerificationPendingData =
      await this.cardPaymentService.getSavedVerificationPendingData(
        correlationId,
      )
    const { paymentFlowId } = savedVerificationPendingData

    try {
      const { success } =
        await this.cardPaymentService.verifyThreeDSecureCallback({
          cardVerificationCallbackInput,
          mdPayload,
          savedVerificationPendingData,
        })

      if (!success) {
        throw new BadRequestException(PaymentServiceCode.CouldNotVerifyCallback)
      }

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Card verification callback completed`,
      })

      return {
        paymentFlowId,
      }
    } catch (e) {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Card verification callback failed: ${e.message}`,
        metadata: {
          error: e.message,
        },
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(
          e.message,
          CardErrorCode.VerificationCallbackFailed,
        ),
      )
    }
  }

  @Get('/verification-status/:paymentFlowId')
  @ApiOkResponse({
    type: VerificationStatusResponse,
  })
  async verificationStatus(
    @Param() params: GetVerificationStatus,
  ): Promise<VerificationStatusResponse> {
    const { paymentFlowId } = params

    const paymentFlowStatus =
      await this.cardPaymentService.getVerificationStatus(paymentFlowId)

    return {
      isVerified: paymentFlowStatus?.isVerified === true,
    }
  }

  @Post('/charge')
  @ApiOkResponse({
    type: ChargeCardResponse,
  })
  async charge(
    @Body() chargeCardInput: ChargeCardInput,
  ): Promise<ChargeCardResponse> {
    const paymentFlowId = chargeCardInput.paymentFlowId
    const paymentConfirmationId = uuid()

    try {
      const { paymentFlow, catalogItems, totalPrice } =
        await this.validatePaymentFlow(paymentFlowId, chargeCardInput.amount)

      const merchantReferenceData = uuid()
      const paymentTrackingData: PaymentTrackingData = {
        merchantReferenceData,
        correlationId: paymentConfirmationId,
        paymentDate: new Date(),
      }

      this.logger.info(
        `[${paymentFlowId}][CARD_PAYMENT] Starting payment with correlation id ${paymentConfirmationId}`,
      )

      const paymentResult = await this.cardPaymentService.charge(
        chargeCardInput,
        paymentTrackingData,
      )

      const persistedPaymentConfirmation =
        await this.persistPaymentConfirmationAndHandleFailure({
          isApplePay: false,
          paymentFlowId,
          chargeCardInput,
          paymentResult,
          totalPrice,
          paymentTrackingData,
        })

      const confirmation = await this.createFjsChargeAndHandleFailure({
        isApplePay: false,
        chargeCardInput,
        paymentFlow,
        catalogItems,
        paymentResult,
        totalPrice,
        merchantReferenceData,
        persistedPaymentConfirmation,
        paymentConfirmationId,
        paymentTrackingData,
      })

      await this.handleSuccessfulPaymentNotification({
        isApplePay: false,
        paymentFlowId,
        paymentResult,
        confirmation,
        chargeCardInput,
        paymentConfirmationId,
        paymentTrackingData,
      })

      return { ...paymentResult, correlationId: paymentResult.correlationID }
    } catch (e) {
      this.logger.error(
        `[${paymentFlowId}][CARD_PAYMENT] Payment failed in main charge handler`,
        { error: e.message, stack: e.stack },
      )
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Card payment processing ultimately failed: ${e.message}`,
        metadata: {
          error: e.message,
        },
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
      )
    }
  }

  @Get('/apple-pay/session')
  @ApiOkResponse({
    type: ApplePaySessionResponse,
  })
  async getApplePaySession() {
    return this.cardPaymentService.getApplePaySession()
  }

  @Post('/apple-pay/charge')
  @ApiOkResponse({
    type: ApplePayChargeResponse,
  })
  async chargeApplePay(
    @Body() chargeCardInput: ApplePayChargeInput,
  ): Promise<ApplePayChargeResponse> {
    const paymentFlowId = chargeCardInput.paymentFlowId
    const paymentConfirmationId = uuid()

    try {
      const { paymentFlow, catalogItems, totalPrice } =
        await this.validatePaymentFlow(paymentFlowId, chargeCardInput.amount)

      const merchantReferenceData = uuid()
      const paymentTrackingData: PaymentTrackingData = {
        merchantReferenceData,
        correlationId: paymentConfirmationId,
        paymentDate: new Date(),
      }

      this.logger.info(
        `[${paymentFlowId}][APPLE_PAY] Starting payment with correlation id ${paymentConfirmationId}`,
      )

      const paymentResult = await this.cardPaymentService.chargeApplePay(
        chargeCardInput,
        paymentTrackingData,
      )

      const persistedPaymentConfirmation =
        await this.persistPaymentConfirmationAndHandleFailure({
          isApplePay: true,
          paymentFlowId,
          chargeCardInput,
          paymentResult,
          totalPrice,
          paymentTrackingData,
        })

      const confirmation = await this.createFjsChargeAndHandleFailure({
        isApplePay: true,
        chargeCardInput,
        paymentFlow,
        catalogItems,
        paymentResult,
        totalPrice,
        merchantReferenceData,
        persistedPaymentConfirmation,
        paymentConfirmationId,
        paymentTrackingData,
      })

      await this.handleSuccessfulPaymentNotification({
        isApplePay: true,
        paymentFlowId,
        paymentResult,
        confirmation,
        chargeCardInput,
        paymentConfirmationId,
        paymentTrackingData,
      })

      return { ...paymentResult, correlationId: paymentResult.correlationID }
    } catch (e) {
      this.logger.error(
        `[${paymentFlowId}][APPLE_PAY] Payment failed in main charge handler`,
        { error: e.message, stack: e.stack },
      )
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Apple Pay payment processing ultimately failed: ${e.message}`,
        metadata: {
          error: e.message,
        },
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
      )
    }
  }

  async finalizePayment(
    @Body()
    finalizePaymentInput: {
      paymentFlowId: string
      paymentConfirmationId: string
    },
  ) {
    const paymentFlowId = finalizePaymentInput.paymentFlowId

    const [paymentFulfillment, cardPaymentConfirmation] = await Promise.all([
      this.paymentFlowService.findPaymentFulfillmentForPaymentFlow(
        paymentFlowId,
      ),
      this.paymentFlowService.getCardPaymentConfirmationForPaymentFlow(
        paymentFlowId,
      ),
    ])

    // If the payment fulfillment does not exist or was not paid by card, the payment flow is not eligible to be finalized
    if (
      !paymentFulfillment ||
      paymentFulfillment.paymentMethod !== 'card' ||
      !cardPaymentConfirmation
    ) {
      throw new BadRequestException(
        PaymentServiceCode.PaymentFlowNotEligibleToBeFinalized,
      )
    }

    // If the payment fulfillment has an fjs charge, the payment flow is already finalized
    if (paymentFulfillment.fjsChargeId) {
      throw new BadRequestException(
        PaymentServiceCode.PaymentFlowAlreadyFinalized,
      )
    }

    const { paymentFlow, catalogItems } = await this.getPaymentFlowDetails(
      paymentFlowId,
    )

    const fjsChargePayload =
      this.cardPaymentService.createCardPaymentChargePayload({
        paymentFlow,
        charges: catalogItems,
        chargeResponse: {
          acquirerReferenceNumber:
            cardPaymentConfirmation.acquirerReferenceNumber,
          authorizationCode: cardPaymentConfirmation.authorizationCode,
          cardScheme: cardPaymentConfirmation.cardScheme,
          maskedCardNumber: cardPaymentConfirmation.maskedCardNumber,
          cardUsage: cardPaymentConfirmation.cardUsage,
        },
        totalPrice: cardPaymentConfirmation.totalPrice,
        merchantReferenceData: cardPaymentConfirmation.merchantReferenceData,
        systemId: environment.chargeFjs.systemId,
      })

    const createdFjsCharge = await retry(
      () =>
        this.paymentFlowService.createFjsCharge(
          paymentFlow.id,
          fjsChargePayload,
        ),
      {
        maxRetries: 3,
        retryDelayMs: 1000,
        logger: this.logger,
        logPrefix: `[${paymentFlowId}] Create FJS Payment Charge`,
        shouldRetryOnError: (error) => {
          return error.message !== FjsErrorCode.AlreadyCreatedCharge
        },
      },
    )

    await 

    return createdFjsCharge
  }

  private async getPaymentFlowDetails(paymentFlowId: string): Promise<{
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
    paymentStatus: PaymentStatus
  }> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      paymentFlowId,
    )
    const [{ catalogItems, totalPrice }, { paymentStatus }] = await Promise.all(
      [
        this.paymentFlowService.getPaymentFlowChargeDetails(
          paymentFlow.organisationId,
          paymentFlow.charges,
        ),
        this.paymentFlowService.getPaymentFlowStatus(paymentFlow),
      ],
    )

    return {
      paymentFlow,
      catalogItems,
      totalPrice,
      paymentStatus,
    }
  }

  private async validatePaymentFlow(
    paymentFlowId: string,
    amount?: number,
  ): Promise<{
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
    paymentStatus: PaymentStatus
  }> {
    const { paymentFlow, catalogItems, totalPrice, paymentStatus } =
      await this.getPaymentFlowDetails(paymentFlowId)

    if (isDefined(amount) && totalPrice !== amount) {
      throw new BadRequestException(
        PaymentServiceCode.PaymentFlowAmountMismatch,
      )
    }

    if (paymentStatus === 'paid') {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    return {
      paymentFlow,
      catalogItems,
      totalPrice,
      paymentStatus,
    }
  }

  private async refund({
    isApplePay,
    paymentFlowId,
    chargeCardInput,
    paymentResult,
    paymentTrackingData,
  }: {
    isApplePay: boolean
    paymentFlowId: string
    chargeCardInput: ApplePayChargeInput | ChargeCardInput
    paymentResult: CardPaymentResponse
    paymentTrackingData: PaymentTrackingData
  }): Promise<RefundResponse> {
    let refund: RefundResponse | null = null

    if (isApplePay) {
      refund = await retry(() =>
        this.cardPaymentService.refundApplePay(paymentTrackingData),
      )
    } else {
      const { cardNumber, amount } = chargeCardInput as ChargeCardInput
      refund = await retry(() =>
        this.cardPaymentService.refund(
          paymentFlowId,
          cardNumber,
          paymentResult,
          amount,
        ),
      )
    }

    return refund
  }

  private async persistPaymentConfirmationAndHandleFailure(
    args:
      | {
        isApplePay: false
        paymentFlowId: string
        chargeCardInput: ChargeCardInput
        paymentResult: CardPaymentResponse
        totalPrice: number
        paymentTrackingData: PaymentTrackingData
      }
      | {
        isApplePay: true
        paymentFlowId: string
        chargeCardInput: ApplePayChargeInput
        paymentResult: CardPaymentResponse
        totalPrice: number
        paymentTrackingData: PaymentTrackingData
      },
  ): Promise<boolean> {
    const {
      isApplePay,
      paymentFlowId,
      chargeCardInput,
      paymentResult,
      totalPrice,
      paymentTrackingData,
    } = args

    try {
      await this.paymentFlowService.createCardPaymentConfirmation({
        paymentResult,
        paymentFlowId: paymentFlowId,
        totalPrice,
        paymentTrackingData,
      })

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_completed',
        message: `Card payment confirmation persisted`,
        metadata: {
          payment: paymentResult,
        },
      })
      return true
    } catch (e) {
      this.logger.error(
        `[${paymentFlowId}] Failed to persist payment confirmation. Attempting refund.`,
        { error: e.message },
      )
      try {
        const refund = await this.refund({
          isApplePay,
          paymentFlowId,
          chargeCardInput,
          paymentResult,
          paymentTrackingData,
        })

        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: paymentFlowId,
          type: 'error',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'other',
          message: `Card payment refunded: failed to persist payment confirmation.`,
          metadata: {
            payment: paymentResult,
            refund,
            originalError: e.message,
          },
        })

        throw new BadRequestException(
          CardErrorCode.RefundedBecauseOfSystemError,
        )
      } catch (refundError) {
        this.logger.error(
          `[${paymentFlowId}] CRITICAL: Accepted payment, failed to persist confirmation, AND failed to refund. Manual intervention required.`,
          {
            originalPersistenceError: e.message,
            refundError: refundError.message,
            payment: paymentResult,
            paymentTrackingData,
          },
        )
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: paymentFlowId,
          type: 'error',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'other',
          message: `CRITICAL: Accepted payment, failed to persist confirmation, AND failed to refund.`,
          metadata: {
            payment: paymentResult,
            paymentTrackingData,
            originalPersistenceError: e.message,
            refundError: refundError.message,
          },
        })
        if (refundError instanceof BadRequestException) throw refundError
        throw new BadRequestException(
          `CRITICAL_ERROR: Payment taken, persistence failed, refund failed. ${e.message}`,
        )
      }
    }
  }

  private async createFjsChargeAndHandleFailure({
    isApplePay,
    chargeCardInput,
    paymentFlow,
    catalogItems,
    paymentResult,
    totalPrice,
    merchantReferenceData,
    persistedPaymentConfirmation,
    paymentConfirmationId,
    paymentTrackingData,
  }: {
    isApplePay: boolean
    chargeCardInput: ChargeCardInput | ApplePayChargeInput
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    paymentResult: CardPaymentResponse
    totalPrice: number
    merchantReferenceData: string
    persistedPaymentConfirmation: boolean
    paymentConfirmationId: string
    paymentTrackingData: PaymentTrackingData
  }): Promise<FjsCharge | null> {
    const paymentFlowId = chargeCardInput.paymentFlowId
    let createdFjsCharge: FjsCharge | null = null
    try {
      // TODO: look into paymentFlow.existingInvoiceId later when we use the existingInvoiceId
      // then we can reuse an existing charge and pay for it
      const fjsChargePayload =
        this.cardPaymentService.createCardPaymentChargePayload({
          paymentFlow,
          charges: catalogItems,
          chargeResponse: {
            acquirerReferenceNumber: paymentResult.acquirerReferenceNumber,
            authorizationCode: paymentResult.authorizationCode,
            cardScheme: paymentResult.cardInformation.cardScheme,
            maskedCardNumber: paymentResult.maskedCardNumber,
            cardUsage: paymentResult.cardInformation.cardUsage,
          },
          totalPrice,
          merchantReferenceData,
          systemId: environment.chargeFjs.systemId,
        })

      createdFjsCharge = await retry(
        () =>
          this.paymentFlowService.createFjsCharge(
            paymentFlow.id,
            fjsChargePayload,
          ),
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          logger: this.logger,
          logPrefix: `[${paymentFlowId}] Create FJS Payment Charge`,
          shouldRetryOnError: (error) => {
            return error.message !== FjsErrorCode.AlreadyCreatedCharge
          },
        },
      )

      return createdFjsCharge
    } catch (e) {
      this.logger.error(
        `[${paymentFlowId}] Failed to create FJS charge information: ${e.message}`,
      )
      const isAlreadyPaidError = e.message === FjsErrorCode.AlreadyCreatedCharge

      if (!persistedPaymentConfirmation || isAlreadyPaidError) {
        this.logger.warn(
          `[${paymentFlowId}] FJS charge failed critically or payment not persisted. Attempting refund.`,
          {
            persistedPaymentConfirmation,
            isAlreadyPaidError,
            error: e.message,
            existingInvoiceId: paymentFlow.existingInvoiceId,
          },
        )
        try {
          const refund = await this.refund({
            isApplePay,
            paymentFlowId,
            chargeCardInput,
            paymentResult,
            paymentTrackingData,
          })

          // After successful refund, delete the payment confirmation.
          if (persistedPaymentConfirmation) {
            try {
              await this.paymentFlowService.deleteCardPaymentConfirmation(
                paymentFlowId,
                paymentConfirmationId,
              )
              this.logger.info(
                `[${paymentFlowId}] Deleted payment confirmation ${paymentConfirmationId} after successful refund due to FJS error.`,
              )
            } catch (delError) {
              this.logger.error(
                `[${paymentFlowId}] Failed to delete payment confirmation ${paymentConfirmationId} after FJS error and refund. Continuing.`,
                { error: delError },
              )
            }
          }

          // Also delete the FJS charge if it exists
          if (createdFjsCharge || isAlreadyPaidError) {
            this.logger.info(
              `[${paymentFlowId}] Attempting to delete FJS charge ${paymentFlow.id} after refund due to FJS charge creation/persistence issue.`,
            )
            await this.paymentFlowService.deleteFjsCharge(paymentFlowId)
          }

          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId: paymentFlowId,
            type: 'error',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'other',
            message: `Card payment refunded: FJS charge failed and payment confirmation was not persisted or FJS indicated already paid.`,
            metadata: {
              payment: paymentResult,
              refund,
              fjsError: e.message,
            },
          })

          const errorCode = isAlreadyPaidError
            ? FjsErrorCode.AlreadyCreatedCharge
            : CardErrorCode.RefundedBecauseOfSystemError

          throw new BadRequestException(errorCode)
        } catch (refundError) {
          this.logger.error(
            `[${paymentFlowId}] CRITICAL: FJS charge failed, payment confirmation issue, AND refund failed. Manual intervention required.`,
            {
              fjsError: e.message,
              persistedPaymentConfirmation,
              refundError: refundError.message,
              payment: paymentResult,
              paymentTrackingData: {
                merchantReferenceData,
                correlationId: paymentResult.correlationID,
              },
            },
          )

          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId: paymentFlowId,
            type: 'error',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'other',
            message: `CRITICAL: FJS charge creation failed, payment confirmation status: ${persistedPaymentConfirmation}, AND failed to refund.`,
            metadata: {
              payment: paymentResult,
              paymentTrackingData: {
                merchantReferenceData,
                correlationId: paymentResult.correlationID,
              },
              fjsError: e.message,
              refundError: refundError.message,
            },
          })

          throw e
        }
      } else {
        this.logger.warn(
          `[${paymentFlowId}] Successfully accepted payment and persisted confirmation, but failed to create FJS charge (will be retried by worker): ${e.message}`,
        )
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'other',
          message: `Accepted payment, but FJS charge creation failed (worker will retry).`,
          metadata: {
            payment: paymentResult,
            fjsError: e.message,
          },
        })
        return null
      }
    }
  }

  private async handleSuccessfulPaymentNotification({
    isApplePay,
    paymentFlowId,
    paymentResult,
    confirmation,
    chargeCardInput,
    paymentConfirmationId,
    paymentTrackingData,
  }: {
    isApplePay: boolean
    paymentFlowId: string
    paymentResult: CardPaymentResponse
    confirmation: FjsCharge | null
    chargeCardInput: ChargeCardInput | ApplePayChargeInput
    paymentConfirmationId: string
    paymentTrackingData: PaymentTrackingData
  }) {
    try {
      await this.paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'payment_completed',
          message: `Card payment completed successfully`,
          metadata: {
            payment: paymentResult,
            charge: confirmation,
          },
        },
        {
          useRetry: true,
          throwOnError: true,
        },
      )
    } catch (logUpdateError) {
      this.logger.error(
        `[${paymentFlowId}] Successfully processed payment but failed to notify the final onUpdateUrl. Attempting refund.`,
        { error: logUpdateError.message },
      )
      try {
        const refund = await this.refund({
          isApplePay,
          paymentFlowId,
          chargeCardInput,
          paymentResult,
          paymentTrackingData,
        })

        // After successful refund, delete the confirmation.
        try {
          await this.paymentFlowService.deleteCardPaymentConfirmation(
            paymentFlowId,
            paymentConfirmationId,
          )
          this.logger.info(
            `[${paymentFlowId}] Deleted payment confirmation ${paymentConfirmationId} after successful refund due to notification failure.`,
          )
        } catch (delError) {
          this.logger.error(
            `[${paymentFlowId}] Failed to delete payment confirmation ${paymentConfirmationId} after notification failure and refund. Continuing.`,
            { error: delError },
          )
        }

        // Also delete the FJS charge if it exists
        if (confirmation?.receptionId) {
          this.logger.info(
            `[${paymentFlowId}] Attempting to delete FJS charge ${confirmation.receptionId} after refund due to notification failure.`,
          )
          await this.paymentFlowService.deleteFjsCharge(paymentFlowId)
        }

        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: paymentFlowId,
          type: 'error',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'other',
          message: `Card payment refunded: failed to notify onUpdateUrl [success].`,
          metadata: {
            payment: paymentResult,
            refund,
            originalNotificationError: logUpdateError.message,
          },
        })

        throw new BadRequestException(
          CardErrorCode.RefundedBecauseOfSystemError,
        )
      } catch (refundError) {
        if (
          refundError instanceof BadRequestException &&
          refundError.message.includes(
            CardErrorCode.RefundedBecauseOfSystemError,
          )
        ) {
          throw refundError
        }

        this.logger.error(
          `[${paymentFlowId}] CRITICAL: Payment successful, final notification failed, AND refund failed. Payment confirmation ${paymentConfirmationId} was NOT deleted. Manual intervention required.`,
          {
            originalNotificationError: logUpdateError.message,
            refundError: refundError.message,
            payment: paymentResult,
            fjsChargeId: confirmation?.receptionId,
          },
        )
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: paymentFlowId,
          type: 'error',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'other',
          message: `CRITICAL: Payment successful, final notification failed, AND refund failed.`,
          metadata: {
            payment: paymentResult,
            originalNotificationError: logUpdateError.message,
            refundError: refundError.message,
            fjsChargeId: confirmation?.receptionId,
          },
        })
        if (refundError instanceof BadRequestException) {
          throw refundError
        }
        throw new BadRequestException(
          `CRITICAL_ERROR: Final notification failed, refund failed. ${refundError.message}`,
        )
      }
    }
  }
}
