import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { CardPaymentService } from './cardPayment.service'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
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
import { CardErrorCode } from '@island.is/shared/constants'

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
  ) {}

  @Post('/verify')
  @ApiOkResponse({
    type: VerifyCardResponse,
  })
  async verify(
    @Body() cardVerificationInput: VerifyCardInput,
  ): Promise<VerifyCardResponse> {
    try {
      await this.paymentFlowService.isEligibleToBePaid(
        cardVerificationInput.paymentFlowId,
      )

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
        message: `Card verification was not started because of an error: ${e.message}`,
      })
      throw new Error(e.message)
    }
  }

  @Post('/verify-callback')
  async verificationCallback(
    @Body() cardVerificationCallbackInput: VerificationCallbackInput,
  ) {
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
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'other',
          message: 'Card verification callback failed',
        })
        return
      }

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: 'Card verification callback completed',
      })
    } catch (e) {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Card verification callback failed: ${e.message}`,
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
      // Will fail if already paid
      const {
        paymentFlow,
        paymentDetails: { catalogItems, totalPrice },
      } = await this.paymentFlowService.getPaymentFlowWithPaymentDetails(
        chargeCardInput.paymentFlowId,
      )

      // Payment confirmation
      const result = await this.cardPaymentService.charge(chargeCardInput)

      let confirmation: null | PaymentFlowFjsChargeConfirmation = null

      try {
        // Send charge confirmation to FJS
        const fjsChargePayload =
          this.cardPaymentService.createCardPaymentChargePayload({
            paymentFlow,
            charges: catalogItems,
            chargeResponse: result,
            totalPrice,
          })

        confirmation = await this.paymentFlowService.createPaymentCharge(
          paymentFlow.id,
          fjsChargePayload,
        )
      } catch (e) {
        // TODO:
        // Never fail the payment if the charge confirmation fails
        // But retry it behind the scenes
        // Implement retry logic later
        // throw new BadRequestException(
        //   'payment_successful_but_fjs_charge_creation_failed',
        // )
        // If the error indicates that this is already paid
        // Error code = 400 and message = "Búið að taka á móti álagningu XXX ..."
        // (there is a 24 hour limit on buying certain items)
        // Then we should refund the payment
      }

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: chargeCardInput.paymentFlowId,
        type: 'success',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_completed',
        message: 'Card payment completed',
        metadata: {
          payment: result,
          charge: confirmation,
        },
      })

      return result
    } catch (e) {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: chargeCardInput.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_failed',
        message: `Card payment failed: ${e.message}`,
      })

      // TODO
      throw new BadRequestException(CardErrorCode.Unknown)
    }
  }
}
