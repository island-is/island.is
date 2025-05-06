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
import { VerifyCardInput } from './dtos/verifyCard.input'
import { VerificationCallbackInput } from './dtos/verificationCallback.input'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { GetVerificationStatus } from './dtos/params.dto'
import { VerificationStatusResponse } from './dtos/verificationStatus.response.dto'
import { VerifyCardResponse } from './dtos/verifyCard.response.dto'
import { ChargeCardResponse } from './dtos/chargeCard.response.dto'
import { PaymentFlowFjsChargeConfirmation } from '../paymentFlow/models/paymentFlowFjsChargeConfirmation.model'
import { VerificationCallbackResponse } from './dtos/verificationCallback.response.dto'
import { CardPaymentService } from './cardPayment.service'
import { PaymentTrackingData } from '../../types/cardPayment'

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
    try {
      const canBePaid = await this.paymentFlowService.isEligibleToBePaid(
        cardVerificationInput.paymentFlowId,
      )

      if (!canBePaid) {
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }

      const verification = await this.cardPaymentService.verify(
        cardVerificationInput,
      )

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: cardVerificationInput.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_started',
        message: 'Card verification started',
      })

      // All required data to build the 3DS screen
      return verification
    } catch (e) {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: cardVerificationInput.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_failed',
        message: `Card verification was not started because of an error`,
        metadata: {
          error: e.message,
        },
      })
      throw new BadRequestException(e.message)
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
      // Confirmed verification from user 3DS
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
        message: 'Card verification callback completed',
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
        message: `Card verification callback failed`,
        metadata: {
          error: e.message,
        },
      })
      throw e
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
    try {
      const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
        chargeCardInput.paymentFlowId,
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

      // Create a unique guid for the merchant reference data
      const merchantReferenceData = uuid()

      // Create a unique guid for the payment confirmation
      const paymentConfirmationId = uuid()

      const paymentTrackingData: PaymentTrackingData = {
        merchantReferenceData,
        correlationId: paymentConfirmationId,
      }

      this.logger.info(
        `Starting card payment for payment flow ${chargeCardInput.paymentFlowId} with correlation id ${paymentConfirmationId}`,
      )

      // Payment confirmation
      const paymentResult = await this.cardPaymentService.charge(
        chargeCardInput,
        paymentTrackingData,
      )

      let persistedPaymentConfirmation = false

      try {
        // Try to persist the payment confirmation
        await this.paymentFlowService.createPaymentConfirmation({
          paymentResult,
          paymentFlowId: chargeCardInput.paymentFlowId,
          totalPrice,
          paymentTrackingData,
        })
        persistedPaymentConfirmation = true

        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: chargeCardInput.paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'payment_completed',
          message: 'Card payment completed',
          metadata: {
            payment: paymentResult,
          },
        })
      } catch (e) {
        // Here we successfully accepted a payment but failed to persist the payment confirmation
        // We should probably refund the payment?

        try {
          const refund = await retry(() =>
            this.cardPaymentService.refund(
              chargeCardInput.cardNumber,
              paymentResult,
              chargeCardInput.amount,
            ),
          )

          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId: chargeCardInput.paymentFlowId,
            type: 'update',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'other',
            message:
              'Card payment refunded because of a failure to persist payment confirmation',
            metadata: {
              payment: paymentResult,
              refund,
            },
          })

          throw new BadRequestException(
            CardErrorCode.RefundedBecauseOfSystemError,
          )
        } catch (e) {
          // need to trigger an alarm for manual intervention
          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId: chargeCardInput.paymentFlowId,
            type: 'failure',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'payment_started',
            message:
              'Accepted payment but failed to persist payment confirmation and failed to refund',
            metadata: {
              payment: paymentResult,
              paymentTrackingData,
            },
          })
        }
      }

      let confirmation: null | PaymentFlowFjsChargeConfirmation = null

      try {
        const fjsChargePayload =
          this.cardPaymentService.createCardPaymentChargePayload({
            paymentFlow,
            charges: catalogItems,
            chargeResponse: paymentResult,
            totalPrice,
            merchantReferenceData,
          })

        // Create a paid charge and send to FJS
        confirmation = await retry(
          () =>
            this.paymentFlowService.createPaymentCharge(
              paymentFlow.id,
              fjsChargePayload,
            ),
          {
            maxRetries: 3,
            retryDelayMs: 1000,
            logger: this.logger,
            logPrefix: 'Failed to createPaymentCharge',
            shouldRetryOnError: (error) => {
              return error.message !== FjsErrorCode.AlreadyCreatedCharge
            },
          },
        )
      } catch (e) {
        this.logger.error(
          `Failed to create FJS charge information: ${e.message}`,
        )

        const isAlreadyPaid = e.message === FjsErrorCode.AlreadyCreatedCharge

        if (!persistedPaymentConfirmation || isAlreadyPaid) {
          // We didn't manage to persist the payment confirmation
          // So we have no way of knowing later if the payment was successful
          // We have to refund the payment
          // What if the refund fails?

          try {
            const refund = await retry(() =>
              this.cardPaymentService.refund(
                chargeCardInput.cardNumber,
                paymentResult,
                chargeCardInput.amount,
              ),
            )

            await this.paymentFlowService.logPaymentFlowUpdate({
              paymentFlowId: chargeCardInput.paymentFlowId,
              type: 'update',
              occurredAt: new Date(),
              paymentMethod: PaymentMethod.CARD,
              reason: 'other',
              message:
                'Card payment refunded because of a failure to persist payment confirmation',
              metadata: {
                payment: paymentResult,
                refund,
              },
            })
          } catch (e) {
            // need to trigger an alarm for manual intervention
            await this.paymentFlowService.logPaymentFlowUpdate({
              paymentFlowId: chargeCardInput.paymentFlowId,
              type: 'failure',
              occurredAt: new Date(),
              paymentMethod: PaymentMethod.CARD,
              reason: 'payment_started',
              message:
                'Accepted payment but failed to persist payment confirmation, to create FJS charge and failed to refund',
              metadata: {
                payment: paymentResult,
                paymentTrackingData,
              },
            })
          }

          throw e
        } else {
          // We managed to at least persist the payment confirmation
          // So we will let the flow continue and pick up the charge
          // confirmation later from a worker

          this.logger.error(
            `Failed to create FJS charge information: ${e.message}`,
          )

          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId: chargeCardInput.paymentFlowId,
            type: 'update',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'other',
            message: `Successfully accepted payment but failed to create FJS charge information`,
            metadata: {
              payment: paymentResult,
            },
          })
        }
      }

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: chargeCardInput.paymentFlowId,
        type: 'success',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_completed',
        message: 'Card payment completed',
        metadata: {
          payment: paymentResult,
          charge: confirmation,
        },
      })

      return paymentResult
    } catch (e) {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: chargeCardInput.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_failed',
        message: `Card payment failed`,
        metadata: {
          error: e.message,
        },
      })

      // TODO
      throw new BadRequestException(e.message || CardErrorCode.UnknownCardError)
    }
  }
}
