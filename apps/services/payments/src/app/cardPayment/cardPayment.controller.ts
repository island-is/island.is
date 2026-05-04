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

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CardErrorCode, PaymentServiceCode } from '@island.is/shared/constants'

import { PaymentMethod } from '../../types'
import { requireStepResult } from '../../utils/orchestrator'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  createApplePayPaymentContext,
  createApplePayPaymentSaga,
} from './applePayPayment.saga'
import {
  ApplePayPaymentContext,
  ApplePayPaymentStepResults,
  CardPaymentContext,
  CardPaymentStepResults,
  PaymentOrchestrator,
} from './cardPayment.orchestrator'
import {
  createCardPaymentContext,
  createCardPaymentSaga,
} from './cardPayment.saga'
import { CardPaymentService } from './cardPayment.service'
import {
  ApplePayChargeInput,
  ApplePayChargeResponse,
  ApplePaySessionResponse,
  ValidateApplePayMerchantInput,
  ChargeCardInput,
  ChargeCardResponse,
  GetVerificationStatus,
  VerificationCallbackInput,
  VerificationCallbackResponse,
  VerificationStatusResponse,
  VerifyCardInput,
  VerifyCardResponse,
} from './dtos'
import { RefundService } from '../refund/refund.service'

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
    private readonly refundService: RefundService,
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
    this.logger.info(`[${paymentFlowId}] Card verification requested`)
    try {
      const { totalPrice } = await this.cardPaymentService.validatePaymentFlow(
        paymentFlowId,
      )

      const verification = await this.cardPaymentService.verify(
        cardVerificationInput,
        totalPrice,
      )

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_started',
        message: `Card verification started`,
      })

      const { correlationID, ...rest } = verification
      return {
        ...rest,
        correlationId: correlationID,
      } as VerifyCardResponse
    } catch (e) {
      try {
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
      } catch (logError) {
        this.logger.warn(
          `[${paymentFlowId}] Failed to log payment flow update and notify upstream after verification error: ${logError.message}`,
          { paymentFlowId, logError },
        )
      }

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
    this.logger.info(`[${paymentFlowId}] Card verification callback received`)

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
      try {
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
      } catch (logError) {
        this.logger.warn(
          `[${paymentFlowId}] Failed to log payment flow update and notify upstream after verification callback error: ${logError.message}`,
          { paymentFlowId, logError },
        )
      }

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

    const context = createCardPaymentContext(paymentFlowId, chargeCardInput)
    const saga = createCardPaymentSaga(
      this.cardPaymentService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      CardPaymentContext,
      CardPaymentStepResults
    >(this.logger, this.paymentFlowService)

    try {
      // execute the payment flow
      const result = await orchestrator.execute(saga, context)

      const { paymentResult } = requireStepResult(result.context, 'CHARGE_CARD')

      return { ...paymentResult, correlationId: paymentResult.correlationID }
    } catch (e) {
      const refundSucceeded = context.metadata?.refundSucceeded === true
      const refundFailed = context.metadata?.refundSucceeded === false

      if (refundSucceeded) {
        throw new BadRequestException(
          CardErrorCode.RefundedBecauseOfSystemError,
        )
      } else if (refundFailed) {
        throw new BadRequestException(
          CardErrorCode.RefundFailedAfterPaymentError,
        )
      } else {
        // Error happened before a charge completed (e.g. VALIDATE or CHARGE_CARD itself failed)
        // let upstream know that the payment failed
        try {
          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId,
            type: 'error',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'payment_failed',
            message: `Card payment saga failed at step ${
              context.failedStep || 'unknown'
            }: ${e.message}`,
            metadata: {
              error: e.message,
              failedStep: context.failedStep,
              completedSteps: context.completedSteps,
            },
          })
        } catch (logError) {
          this.logger.warn(
            `[${paymentFlowId}] Failed to log payment flow update and notify upstream after card payment saga failed: ${logError.message}`,
            { paymentFlowId, logError },
          )
        }

        throw new BadRequestException(
          onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
        )
      }
    }
  }

  @UseGuards(FeatureFlagGuard)
  @FeatureFlag(Features.isIslandisApplePayPaymentEnabled)
  @Post('/apple-pay/charge')
  @ApiOkResponse({
    type: ApplePayChargeResponse,
  })
  async chargeApplePay(
    @Body() chargeCardInput: ApplePayChargeInput,
  ): Promise<ApplePayChargeResponse> {
    const paymentFlowId = chargeCardInput.paymentFlowId
    this.logger.info(`[${paymentFlowId}] Apple Pay charge endpoint called`)

    const context = createApplePayPaymentContext(paymentFlowId, chargeCardInput)
    const saga = createApplePayPaymentSaga(
      this.cardPaymentService,
      this.refundService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      ApplePayPaymentContext,
      ApplePayPaymentStepResults
    >(this.logger, this.paymentFlowService)

    try {
      const result = await orchestrator.execute(saga, context)

      const { paymentResult } = requireStepResult(
        result.context,
        'CHARGE_APPLE_PAY',
      )

      this.logger.info(
        `[${paymentFlowId}] Apple Pay charge endpoint completed`,
        {
          paymentFlowId,
          isSuccess: paymentResult.isSuccess,
        },
      )

      return { ...paymentResult, correlationId: paymentResult.correlationID }
    } catch (e) {
      const refundSucceeded = context.metadata?.refundSucceeded === true
      const refundFailed = context.metadata?.refundSucceeded === false

      if (refundSucceeded) {
        throw new BadRequestException(
          CardErrorCode.RefundedBecauseOfSystemError,
        )
      } else if (refundFailed) {
        throw new BadRequestException(
          CardErrorCode.RefundFailedAfterPaymentError,
        )
      } else {
        // Error happened before a charge completed (e.g. VALIDATE or CHARGE_APPLE_PAY itself failed)
        // let upstream know that the payment failed
        try {
          await this.paymentFlowService.logPaymentFlowUpdate({
            paymentFlowId,
            type: 'error',
            occurredAt: new Date(),
            paymentMethod: PaymentMethod.CARD,
            reason: 'payment_failed',
            message: `Apple Pay payment saga failed at step ${
              context.failedStep || 'unknown'
            }: ${e.message}`,
            metadata: {
              error: e.message,
              failedStep: context.failedStep,
              completedSteps: context.completedSteps,
            },
          })
        } catch (logError) {
          this.logger.warn(
            `[${paymentFlowId}] Failed to log payment flow update and notify upstream after Apple Pay saga failed: ${logError.message}`,
            { paymentFlowId, logError },
          )
        }

        throw new BadRequestException(
          onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
        )
      }
    }
  }

  @UseGuards(FeatureFlagGuard)
  @FeatureFlag(Features.isIslandisApplePayPaymentEnabled)
  @Post('/apple-pay/validate-merchant')
  @ApiOkResponse({
    type: ApplePaySessionResponse,
  })
  async validateApplePayMerchant(
    @Body() input: ValidateApplePayMerchantInput,
  ): Promise<ApplePaySessionResponse> {
    this.logger.info('Apple Pay validate-merchant endpoint called', {
      validationURL: input.validationURL,
    })

    try {
      const { session } =
        await this.cardPaymentService.validateApplePayMerchant(
          input.validationURL,
        )

      this.logger.info('Apple Pay validate-merchant endpoint completed', {
        sessionLength: session.length,
      })

      return { session }
    } catch (e) {
      this.logger.error('Apple Pay validate-merchant endpoint failed', {
        error: e.message,
        validationURL: input.validationURL,
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(
          e.message,
          CardErrorCode.ErrorGettingApplePaySession,
        ),
      )
    }
  }
}
