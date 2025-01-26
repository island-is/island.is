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
import { getPayloadFromMd } from './cardPayment.utils'

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
      await this.paymentFlowService.getPaymentFlow(
        chargeCardInput.paymentFlowId,
      )

      // Payment confirmation
      const result = await this.cardPaymentService.charge(chargeCardInput)

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: chargeCardInput.paymentFlowId,
        type: 'success',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_completed',
        message: 'Card payment completed',
        metadata: result,
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
      throw new BadRequestException('todo_code')
    }
  }
}
