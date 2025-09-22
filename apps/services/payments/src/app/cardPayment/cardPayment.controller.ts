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
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentMethod } from '../../types'
import { ChargeResponse } from './cardPayment.types'
import { VerifyCardInput } from './dtos/verifyCard.input'
import { VerificationCallbackInput } from './dtos/verificationCallback.input'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { GetVerificationStatus } from './dtos/params.dto'
import { VerificationStatusResponse } from './dtos/verificationStatus.response.dto'
import { VerifyCardResponse } from './dtos/verifyCard.response.dto'
import { ChargeCardResponse } from './dtos/chargeCard.response.dto'
import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { VerificationCallbackResponse } from './dtos/verificationCallback.response.dto'
import { CardPaymentService } from './cardPayment.service'
import { PaymentTrackingData } from '../../types/cardPayment'
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
  ) {}

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
      return verification
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
      const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
        paymentFlowId,
      )
      const [{ catalogItems, totalPrice }, { paymentStatus }] =
        await Promise.all([
          this.paymentFlowService.getPaymentFlowChargeDetails(
            paymentFlow.organisationId,
            paymentFlow.charges,
          ),
          this.paymentFlowService.getPaymentFlowStatus(paymentFlow),
        ])

      if (totalPrice !== chargeCardInput.amount) {
        throw new BadRequestException(
          PaymentServiceCode.PaymentFlowAmountMismatch,
        )
      }

      if (paymentStatus === 'paid') {
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }

      const merchantReferenceData = uuid()
      const paymentTrackingData: PaymentTrackingData = {
        merchantReferenceData,
        correlationId: paymentConfirmationId,
      }

      this.logger.info(
        `[${paymentFlowId}] Starting card payment with correlation id ${paymentConfirmationId}`,
      )

      const paymentResult = await this.cardPaymentService.charge(
        chargeCardInput,
        paymentTrackingData,
      )

      const persistedPaymentConfirmation =
        await this.persistPaymentConfirmationAndHandleFailure(
          chargeCardInput,
          paymentResult,
          totalPrice,
          paymentTrackingData,
        )

      const confirmation = await this.createFjsChargeAndHandleFailure(
        chargeCardInput,
        paymentFlow,
        catalogItems,
        paymentResult,
        totalPrice,
        merchantReferenceData,
        persistedPaymentConfirmation,
        paymentConfirmationId,
      )

      await this.handleSuccessfulPaymentNotification(
        paymentFlowId,
        paymentResult,
        confirmation,
        chargeCardInput,
        paymentConfirmationId,
      )

      return paymentResult
    } catch (e) {
      this.logger.error(
        `[${paymentFlowId}] Card payment failed in main charge handler`,
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

  private async persistPaymentConfirmationAndHandleFailure(
    chargeCardInput: ChargeCardInput,
    paymentResult: ChargeCardResponse,
    totalPrice: number,
    paymentTrackingData: PaymentTrackingData,
  ): Promise<boolean> {
    const paymentFlowId = chargeCardInput.paymentFlowId
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
        const refund = await retry(() =>
          this.cardPaymentService.refund(
            paymentFlowId,
            chargeCardInput.cardNumber,
            paymentResult as ChargeResponse,
            chargeCardInput.amount,
          ),
        )
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

  private async createFjsChargeAndHandleFailure(
    chargeCardInput: ChargeCardInput,
    paymentFlow: PaymentFlowAttributes,
    catalogItems: CatalogItemWithQuantity[],
    paymentResult: ChargeCardResponse,
    totalPrice: number,
    merchantReferenceData: string,
    persistedPaymentConfirmation: boolean,
    paymentConfirmationId: string,
  ): Promise<FjsCharge | null> {
    const paymentFlowId = chargeCardInput.paymentFlowId
    let createdFjsCharge: FjsCharge | null = null
    try {
      // TODO: look into paymentFlow.existingInvoiceId later when we use the existingInvoiceId
      // then we can reuse an existing charge and pay for it
      const fjsChargePayload =
        this.cardPaymentService.createCardPaymentChargePayload({
          paymentFlow,
          charges: catalogItems,
          chargeResponse: paymentResult,
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
          const refund = await retry(() =>
            this.cardPaymentService.refund(
              paymentFlowId,
              chargeCardInput.cardNumber,
              paymentResult as ChargeResponse,
              chargeCardInput.amount,
            ),
          )

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
                correlationId: paymentResult.correlationId,
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
                correlationId: paymentResult.correlationId,
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

  private async handleSuccessfulPaymentNotification(
    paymentFlowId: string,
    paymentResult: ChargeResponse,
    confirmation: FjsCharge | null,
    chargeCardInput: ChargeCardInput,
    paymentConfirmationId: string,
  ) {
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
        const refund = await retry(() =>
          this.cardPaymentService.refund(
            paymentFlowId,
            chargeCardInput.cardNumber,
            paymentResult as ChargeResponse,
            chargeCardInput.amount,
          ),
        )

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
