import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CardErrorCode,
  PaymentServiceCode,
  DebtPaymentErrorCode,
} from '@island.is/shared/constants'

import { InferAttributes } from 'sequelize'

import { PaymentMethod } from '../../types'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { BankTransferService } from '../bankTransferPayment/bankTransfer.service'
import { ATTEMPT_CLAIM_WINDOW_MS } from '../debtPayment/debtSettlement.service'
import { FjsDebtPayment, PaymentFulfillment } from '../paymentFlow/models'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  createCardRefundContext,
  createCardRefundSaga,
  CARD_REFUND_SAGA_START_STEP,
} from './cardRefund.saga'
import {
  createInvoiceRefundContext,
  createInvoiceRefundSaga,
} from './invoiceRefund.saga'
import {
  createBankTransferRefundContext,
  createBankTransferRefundSaga,
  BANK_TRANSFER_REFUND_SAGA_START_STEP,
} from './bankTransferRefund.saga'
import { RefundPaymentInput, RefundMethod, RefundPaymentResponse } from './dtos'
import {
  BankTransferRefundContext,
  BankTransferRefundStepResults,
  CardRefundContext,
  CardRefundStepResults,
  InvoiceRefundContext,
  InvoiceRefundStepResults,
  PaymentOrchestrator,
} from './refund.orchestrator'
import { RefundService } from './refund.service'

/** Runs the refund sagas. Used by the refund endpoint and by the payment worker. */
@Injectable()
export class RefundOrchestrationService {
  constructor(
    private readonly refundService: RefundService,
    private readonly paymentFlowService: PaymentFlowService,
    private readonly bankTransferService: BankTransferService,
    @InjectModel(FjsDebtPayment)
    private readonly fjsDebtPaymentModel: typeof FjsDebtPayment,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  /**
   * Refunds a paid flow through the saga of the method it was paid with.
   *
   * Callers outside the system can not refund a debt payment that FJS registered or may have
   * registered, FJS has no reversal. `system` refunds, the worker undoing a payment FJS rejected,
   * skip that check.
   */
  async refund(
    refundPaymentInput: RefundPaymentInput,
    { system = false }: { system?: boolean } = {},
  ): Promise<RefundPaymentResponse> {
    const { paymentFlowId } = refundPaymentInput

    if (!system) {
      await this.assertDebtPaymentCanBeRefunded(paymentFlowId)
    }

    const paymentFulfillment =
      await this.paymentFlowService.findPaymentFulfillmentForPaymentFlow(
        paymentFlowId,
      )

    if (paymentFulfillment?.paymentMethod === 'card') {
      return this.handleCardRefund(refundPaymentInput, paymentFulfillment)
    } else if (paymentFulfillment?.paymentMethod === 'invoice') {
      return this.handleInvoiceRefund(refundPaymentInput, paymentFulfillment)
    } else if (paymentFulfillment?.paymentMethod === 'bank_transfer') {
      return this.handleBankTransferRefund(
        refundPaymentInput,
        paymentFulfillment,
      )
    }

    throw new BadRequestException(
      PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
    )
  }

  private async handleCardRefund(
    input: RefundPaymentInput,
    paymentFulfillment: InferAttributes<PaymentFulfillment>,
  ): Promise<RefundPaymentResponse> {
    const { paymentFlowId } = input

    const context = createCardRefundContext(
      paymentFlowId,
      input,
      paymentFulfillment,
    )
    const saga = createCardRefundSaga(
      this.refundService,
      this.paymentFlowService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      CardRefundContext,
      CardRefundStepResults
    >(this.logger, this.paymentFlowService)

    try {
      const result = await orchestrator.execute(
        saga,
        context,
        CARD_REFUND_SAGA_START_STEP,
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
      return this.handleRefundError(
        e,
        context,
        paymentFlowId,
        PaymentMethod.CARD,
      )
    }
  }

  private async handleInvoiceRefund(
    input: RefundPaymentInput,
    paymentFulfillment: InferAttributes<PaymentFulfillment>,
  ): Promise<RefundPaymentResponse> {
    const { paymentFlowId } = input

    const context = createInvoiceRefundContext(
      paymentFlowId,
      input,
      paymentFulfillment,
    )
    const saga = createInvoiceRefundSaga(this.paymentFlowService, this.logger)
    const orchestrator = new PaymentOrchestrator<
      InvoiceRefundContext,
      InvoiceRefundStepResults
    >(this.logger, this.paymentFlowService)

    try {
      await orchestrator.execute(saga, context)

      return {
        success: true,
        refundMethod: RefundMethod.FJS_CHARGE_DELETED,
        message: 'Invoice payment successfully refunded',
      }
    } catch (e) {
      return this.handleRefundError(
        e,
        context,
        paymentFlowId,
        PaymentMethod.INVOICE,
      )
    }
  }

  private async handleBankTransferRefund(
    input: RefundPaymentInput,
    paymentFulfillment: InferAttributes<PaymentFulfillment>,
  ): Promise<RefundPaymentResponse> {
    const { paymentFlowId } = input

    const context = createBankTransferRefundContext(
      paymentFlowId,
      input,
      paymentFulfillment,
    )
    const saga = createBankTransferRefundSaga(
      this.paymentFlowService,
      this.bankTransferService,
      this.logger,
    )
    const orchestrator = new PaymentOrchestrator<
      BankTransferRefundContext,
      BankTransferRefundStepResults
    >(this.logger, this.paymentFlowService)

    try {
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      return {
        success: true,
        refundMethod: RefundMethod.FJS_CHARGE_DELETED,
        message: 'Bank transfer payment successfully refunded',
      }
    } catch (e) {
      return this.handleRefundError(
        e,
        context,
        paymentFlowId,
        PaymentMethod.BANK_TRANSFER,
      )
    }
  }

  private async handleRefundError(
    e: Error,
    context: {
      metadata?: Record<string, unknown>
      failedStep?: string
      completedSteps?: string[]
    },
    paymentFlowId: string,
    paymentMethod: PaymentMethod,
  ): Promise<RefundPaymentResponse> {
    const refundExecuted =
      context.metadata?.refundSucceededButRollbackFailed === true

    if (refundExecuted) {
      try {
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod,
          reason: 'refund_completed',
          message: 'Payment successfully refunded, but cleanup failed',
          metadata: {
            cleanupFailed: true,
            failedStep: context.failedStep,
            error: e.message,
          },
        })
      } catch (logError) {
        this.logger.warn(
          `[${paymentFlowId}] Failed to log payment flow update and notify upstream after refund cleanup failed: ${logError.message}`,
          { paymentFlowId, logError },
        )
      }

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
      paymentMethod,
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

  private async assertDebtPaymentCanBeRefunded(
    paymentFlowId: string,
  ): Promise<void> {
    const debtPayment = await this.fjsDebtPaymentModel.findOne({
      where: { paymentFlowId },
    })

    if (
      debtPayment?.status === 'registered' ||
      debtPayment?.status === 'needs_reconciliation'
    ) {
      throw new BadRequestException(
        DebtPaymentErrorCode.DebtPaymentRegisteredCannotBeRefunded,
      )
    }

    // A pending payment may be registered already: an earlier payDebt had an unknown outcome (a
    // lost 202 is final at FJS), or an attempt started within the claim window. The worker settles it.
    const isAttemptRunning =
      !!debtPayment?.lastAttemptAt &&
      debtPayment.lastAttemptAt.getTime() > Date.now() - ATTEMPT_CLAIM_WINDOW_MS

    if (
      debtPayment?.status === 'pending' &&
      (debtPayment.hadAmbiguousAttempt || isAttemptRunning)
    ) {
      this.logger.warn(
        `[${paymentFlowId}] Refused to refund a debt payment that may be registered with FJS`,
        {
          // Monitors count on this field, not the message text.
          debtRefundRefused: true,
          hadAmbiguousAttempt: debtPayment.hadAmbiguousAttempt,
          isAttemptRunning,
        },
      )
      throw new BadRequestException(
        DebtPaymentErrorCode.DebtPaymentRegisteredCannotBeRefunded,
      )
    }
  }
}
