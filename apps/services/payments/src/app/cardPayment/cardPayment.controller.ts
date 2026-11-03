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
import {
  CardErrorCode,
  PaymentServiceCode,
  DebtPaymentErrorCode,
} from '@island.is/shared/constants'

import { PaymentMethod } from '../../types'
import { CardPaymentSuccessResponse } from '../../types/cardPayment'
import { requireStepResult } from '../../utils/orchestrator'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { notifyKeptDebtPayment } from './cardPayment.debt'
import {
  createApplePayPaymentContext,
  createApplePayPaymentSaga,
} from './applePay/applePayPayment.saga'
import {
  ApplePayPaymentContext,
  ApplePayPaymentStepResults,
  CardPaymentContext,
  CardPaymentStepResults,
  GooglePayChargeContext,
  GooglePayChargeStepResults,
  GooglePayPaymentContext,
  GooglePayPaymentStepResults,
  PaymentOrchestrator,
} from './cardPayment.orchestrator'
import {
  createCardPaymentContext,
  createCardPaymentSaga,
} from './card/cardPayment.saga'
import {
  chargedGooglePayPaymentResult,
  createGooglePayChargeContext,
  createGooglePayChargeSaga,
} from './googlePay/googlePayCharge.saga'
import {
  createGooglePayPaymentContext,
  createGooglePayPaymentSaga,
} from './googlePay/googlePayPayment.saga'
import { GooglePaySagaContext } from './googlePay/googlePaySaga.shared'
import { CardPaymentService } from './cardPayment.service'
import {
  ApplePayChargeInput,
  ApplePayChargeResponse,
  ApplePaySessionResponse,
  ValidateApplePayMerchantInput,
} from './applePay/dtos'
import {
  ChargeCardInput,
  ChargeCardResponse,
  GetVerificationStatus,
  VerificationCallbackInput,
  VerificationCallbackResponse,
  VerificationStatusResponse,
  VerifyCardInput,
  VerifyCardResponse,
} from './card/dtos'
import {
  GooglePayChargeInput,
  GooglePayChargeResponse,
  GooglePayChargeVerifiedInput,
} from './googlePay/dtos'
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
      // The rollback left a debt payment that may be registered with FJS as it is, see
      // keepDebtPayment: the payer paid, like when the webhook fails.
      if (context.metadata?.debtPaymentKept === true) {
        const { paymentFlow } = requireStepResult(context, 'VALIDATE')
        const { paymentResult } = requireStepResult(context, 'CHARGE_CARD')

        await notifyKeptDebtPayment({
          paymentFlowService: this.paymentFlowService,
          logger: this.logger,
          ctx: context,
          paymentFlow,
          paymentResult,
          message: 'Card payment completed successfully',
        })

        return { ...paymentResult, correlationId: paymentResult.correlationID }
      }

      const refundSucceeded = context.metadata?.refundSucceeded === true
      const refundFailed = context.metadata?.refundSucceeded === false

      if (refundSucceeded) {
        // FJS rejected the debts, the card is refunded and the flow is closed
        if (e.message === DebtPaymentErrorCode.DebtPaymentRejected) {
          throw new BadRequestException(
            DebtPaymentErrorCode.DebtPaymentRejected,
          )
        }

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
      // The rollback left a debt payment that may be registered with FJS as it is, see
      // keepDebtPayment: the payer paid, like when the webhook fails.
      if (context.metadata?.debtPaymentKept === true) {
        const { paymentFlow } = requireStepResult(context, 'VALIDATE')
        const { paymentResult } = requireStepResult(context, 'CHARGE_APPLE_PAY')

        await notifyKeptDebtPayment({
          paymentFlowService: this.paymentFlowService,
          logger: this.logger,
          ctx: context,
          paymentFlow,
          paymentResult,
          message: 'Apple Pay payment completed successfully',
        })

        return { ...paymentResult, correlationId: paymentResult.correlationID }
      }

      const refundSucceeded = context.metadata?.refundSucceeded === true
      const refundFailed = context.metadata?.refundSucceeded === false

      if (refundSucceeded) {
        // FJS rejected the debts, the card is refunded and the flow is closed
        if (e.message === DebtPaymentErrorCode.DebtPaymentRejected) {
          throw new BadRequestException(
            DebtPaymentErrorCode.DebtPaymentRejected,
          )
        }

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
  @FeatureFlag(Features.isIslandisGooglePayPaymentEnabled)
  @Post('/google-pay/charge')
  @ApiOkResponse({
    type: GooglePayChargeResponse,
  })
  async chargeGooglePay(
    @Body() chargeInput: GooglePayChargeInput,
  ): Promise<GooglePayChargeResponse> {
    const paymentFlowId = chargeInput.paymentFlowId
    this.logger.info(`[${paymentFlowId}] Google Pay charge endpoint called`)

    const context = createGooglePayChargeContext(paymentFlowId, chargeInput)
    const saga = createGooglePayChargeSaga(
      this.cardPaymentService,
      this.refundService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      GooglePayChargeContext,
      GooglePayChargeStepResults
    >(this.logger, this.paymentFlowService)

    try {
      await orchestrator.execute(saga, context, 'VALIDATE')
    } catch (e) {
      await this.reportGooglePaySagaFailure({
        error: e,
        context,
        getPaymentResult: chargedGooglePayPaymentResult,
        unknownErrorCode: CardErrorCode.VerificationFailed,
      })
    }

    // A card saved in the Google account: it passes 3-D Secure first and is
    // then charged through charge-verified with the same token
    const started = context.stepResults.START_VERIFICATION
    if (started) {
      const { correlationID, ...rest } = started.verification
      return {
        status: 'verification_required',
        verification: {
          ...rest,
          correlationId: correlationID,
        } as VerifyCardResponse,
      }
    }

    // A device token: the gateway charged it when it decrypted it
    const paymentResult = chargedGooglePayPaymentResult(context)

    this.logger.info(
      `[${paymentFlowId}] Google Pay charge endpoint completed`,
      {
        paymentFlowId,
        isSuccess: paymentResult.isSuccess,
      },
    )

    return {
      status: 'paid',
      payment: { ...paymentResult, correlationId: paymentResult.correlationID },
    }
  }

  @UseGuards(FeatureFlagGuard)
  @FeatureFlag(Features.isIslandisGooglePayPaymentEnabled)
  @Post('/google-pay/charge-verified')
  @ApiOkResponse({
    type: ChargeCardResponse,
  })
  async chargeGooglePayVerified(
    @Body() chargeInput: GooglePayChargeVerifiedInput,
  ): Promise<ChargeCardResponse> {
    const paymentFlowId = chargeInput.paymentFlowId
    this.logger.info(
      `[${paymentFlowId}] Google Pay verified charge endpoint called`,
    )

    const context = createGooglePayPaymentContext(paymentFlowId, chargeInput)
    const saga = createGooglePayPaymentSaga(
      this.cardPaymentService,
      this.refundService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      GooglePayPaymentContext,
      GooglePayPaymentStepResults
    >(this.logger, this.paymentFlowService)
    const getPaymentResult = (ctx: GooglePayPaymentContext) =>
      requireStepResult(ctx, 'CHARGE_GOOGLE_PAY').paymentResult

    try {
      await orchestrator.execute(saga, context)
    } catch (e) {
      await this.reportGooglePaySagaFailure({
        error: e,
        context,
        getPaymentResult,
        unknownErrorCode: CardErrorCode.UnknownCardError,
      })
    }

    const paymentResult = getPaymentResult(context)

    this.logger.info(
      `[${paymentFlowId}] Google Pay verified charge endpoint completed`,
      {
        paymentFlowId,
        isSuccess: paymentResult.isSuccess,
      },
    )

    return { ...paymentResult, correlationId: paymentResult.correlationID }
  }

  /**
   * Answers a failed Google Pay saga: throws the error the payer is told
   * about, after telling the organisation when no payment was taken. Returns
   * only when the rollback left a debt payment that may be registered with
   * FJS as it is, see keepDebtPayment: the payer paid, like when the webhook
   * fails, and the caller answers with the payment.
   */
  private async reportGooglePaySagaFailure<
    TContext extends GooglePaySagaContext,
  >({
    error,
    context,
    getPaymentResult,
    unknownErrorCode,
  }: {
    error: Error
    context: TContext
    /** The payment the saga took, when the rollback kept it */
    getPaymentResult: (ctx: TContext) => CardPaymentSuccessResponse
    /** The payer's error for a failure before any payment that is not a known code */
    unknownErrorCode: CardErrorCode
  }): Promise<void> {
    const { paymentFlowId } = context

    if (context.metadata?.debtPaymentKept === true) {
      const { paymentFlow } = requireStepResult(context, 'VALIDATE')

      await notifyKeptDebtPayment({
        paymentFlowService: this.paymentFlowService,
        logger: this.logger,
        ctx: context,
        paymentFlow,
        paymentResult: getPaymentResult(context),
        message: 'Google Pay payment completed successfully',
      })

      return
    }

    const refundSucceeded = context.metadata?.refundSucceeded === true
    const refundFailed = context.metadata?.refundSucceeded === false

    if (refundSucceeded) {
      // FJS rejected the debts, the card is refunded and the flow is closed
      if (error.message === DebtPaymentErrorCode.DebtPaymentRejected) {
        throw new BadRequestException(DebtPaymentErrorCode.DebtPaymentRejected)
      }

      throw new BadRequestException(CardErrorCode.RefundedBecauseOfSystemError)
    }

    if (refundFailed) {
      throw new BadRequestException(CardErrorCode.RefundFailedAfterPaymentError)
    }

    // No payment the saga knows of was taken (VALIDATE, the gateway call or
    // 3-D Secure failed): let upstream know that the payment failed. The
    // correlation id is what a wallet transaction with an unknown outcome
    // would be found by, see refundUnsettledGooglePayCharge.
    try {
      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_failed',
        message: `Google Pay payment saga failed at step ${
          context.failedStep || 'unknown'
        }: ${error.message}`,
        metadata: {
          error: error.message,
          failedStep: context.failedStep,
          completedSteps: context.completedSteps,
          correlationId: context.trackingData.correlationId,
        },
      })
    } catch (logError) {
      this.logger.warn(
        `[${paymentFlowId}] Failed to log payment flow update and notify upstream after Google Pay saga failed: ${logError.message}`,
        { paymentFlowId, logError },
      )
    }

    throw new BadRequestException(
      onlyReturnKnownErrorCode(error.message, unknownErrorCode),
    )
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
