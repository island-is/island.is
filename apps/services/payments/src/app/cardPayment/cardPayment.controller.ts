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
  RefundContext,
  RefundStepResults,
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
  ChargeCardInput,
  ChargeCardResponse,
  GetVerificationStatus,
  RefundCardPaymentInput,
  RefundCardPaymentResponse,
  RefundMethod,
  VerificationCallbackInput,
  VerificationCallbackResponse,
  VerificationStatusResponse,
  VerifyCardInput,
  VerifyCardResponse,
} from './dtos'
import {
  createRefundContext,
  createRefundSaga,
  REFUND_SAGA_START_STEP,
} from './refund.saga'

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

    // setup payment context and flow
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
      // check if the refund succeeded or failed
      const refundSucceeded = context.metadata?.refundSucceeded === true
      const refundFailed = context.metadata?.refundSucceeded === false

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Card payment saga failed at step ${
          context.failedStep || 'unknown'
        }: ${e.message}`,
        metadata: {
          error: e.message,
          failedStep: context.failedStep,
          completedSteps: context.completedSteps,
          refundSucceeded,
        },
      })

      if (refundSucceeded) {
        // Refund succeeded - user was not charged
        throw new BadRequestException(
          CardErrorCode.RefundedBecauseOfSystemError,
        )
      } else if (refundFailed) {
        // CRITICAL: Payment taken but refund failed
        throw new BadRequestException(CardErrorCode.UnknownCardError)
      } else {
        throw new BadRequestException(
          onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
        )
      }
    }
  }

  @Post('/apple-pay/charge')
  @ApiOkResponse({
    type: ApplePayChargeResponse,
  })
  async chargeApplePay(
    @Body() chargeCardInput: ApplePayChargeInput,
  ): Promise<ApplePayChargeResponse> {
    const paymentFlowId = chargeCardInput.paymentFlowId

    // setup payment context and flow
    const context = createApplePayPaymentContext(paymentFlowId, chargeCardInput)
    const saga = createApplePayPaymentSaga(
      this.cardPaymentService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      ApplePayPaymentContext,
      ApplePayPaymentStepResults
    >(this.logger, this.paymentFlowService)

    try {
      // execute the payment flow
      const result = await orchestrator.execute(saga, context)

      const { paymentResult } = requireStepResult(
        result.context,
        'CHARGE_APPLE_PAY',
      )

      return { ...paymentResult, correlationId: paymentResult.correlationID }
    } catch (e) {
      const refundSucceeded = context.metadata?.refundSucceeded === true
      const refundFailed = context.metadata?.refundSucceeded === false

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'other',
        message: `Apple Pay payment saga failed at step ${
          context.failedStep || 'unknown'
        }: ${e.message}`,
        metadata: {
          error: e.message,
          failedStep: context.failedStep,
          completedSteps: context.completedSteps,
          refundSucceeded,
          refundFailed,
        },
      })

      if (refundSucceeded) {
        throw new BadRequestException(
          CardErrorCode.RefundedBecauseOfSystemError,
        )
      } else if (refundFailed) {
        // CRITICAL: Payment taken but refund failed
        throw new BadRequestException(CardErrorCode.UnknownCardError)
      } else {
        throw new BadRequestException(
          onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
        )
      }
    }
  }

  @Get('/apple-pay/session')
  @ApiOkResponse({
    type: ApplePaySessionResponse,
  })
  async getApplePaySession() {
    try {
      return this.cardPaymentService.getApplePaySession()
    } catch (e) {
      throw new BadRequestException(
        onlyReturnKnownErrorCode(
          e.message,
          CardErrorCode.ErrorGettingApplePaySession,
        ),
      )
    }
  }

  @Post('/refund')
  @ApiOkResponse({
    type: RefundCardPaymentResponse,
  })
  async refund(
    @Body() refundCardPaymentInput: RefundCardPaymentInput,
  ): Promise<RefundCardPaymentResponse> {
    const paymentFlowId = refundCardPaymentInput.paymentFlowId

    const context = createRefundContext(paymentFlowId, refundCardPaymentInput)
    const saga = createRefundSaga(
      this.cardPaymentService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      RefundContext,
      RefundStepResults
    >(this.logger, this.paymentFlowService)

    try {
      const result = await orchestrator.execute(
        saga,
        context,
        REFUND_SAGA_START_STEP,
      )

      const refundMethod = result.context.completedSteps.includes(
        'REFUND_PAYMENT',
      )
        ? RefundMethod.PAYMENT_GATEWAY
        : RefundMethod.FJS_CHARGE_DELETED

      return {
        success: true,
        refundMethod,
        message: 'Payment successfully refunded',
      }
    } catch (e) {
      const refundExecuted =
        context.metadata?.refundSucceededButRollbackFailed === true

      // User got their money back - log success so audit trail and upstream reflect reality
      if (refundExecuted) {
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'refund_completed',
          message: 'Payment successfully refunded, but cleanup failed',
          metadata: {
            cleanupFailed: true,
            failedStep: context.failedStep,
            error: e.message,
          },
        })

        this.logger.error(
          `[${paymentFlowId}][CRITICAL] Refund succeeded but cleanup failed`,
          { error: e.message, context },
        )

        const refundMethod = context.completedSteps?.includes('REFUND_PAYMENT')
          ? RefundMethod.PAYMENT_GATEWAY
          : RefundMethod.FJS_CHARGE_DELETED

        return {
          success: true,
          refundMethod,
          message:
            'Refund processed successfully. System cleanup is in progress.',
        }
      }

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'refund_failed',
        message: `Refund saga failed at step ${
          context.failedStep || 'unknown'
        }: ${e.message}`,
        metadata: {
          error: e.message,
          failedStep: context.failedStep,
          completedSteps: context.completedSteps,
        },
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(e.message, CardErrorCode.UnknownCardError),
      )
    }
  }
}
