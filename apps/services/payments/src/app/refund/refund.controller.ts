import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CardErrorCode, PaymentServiceCode } from '@island.is/shared/constants'

import { InferAttributes } from 'sequelize'

import { PaymentMethod } from '../../types'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
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
import { RefundPaymentInput } from './dtos/refundPayment.input'
import {
  RefundMethod,
  RefundPaymentResponse,
} from './dtos/refundPayment.response'
import {
  CardRefundContext,
  CardRefundStepResults,
  InvoiceRefundContext,
  InvoiceRefundStepResults,
  PaymentOrchestrator,
} from './refund.orchestrator'
import { RefundService } from './refund.service'

@ApiTags('payments')
@Controller({
  path: 'payments/refund',
  version: ['1'],
})
export class RefundController {
  constructor(
    private readonly refundService: RefundService,
    private readonly paymentFlowService: PaymentFlowService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiOkResponse({
    type: RefundPaymentResponse,
  })
  async refund(
    @Body() refundPaymentInput: RefundPaymentInput,
  ): Promise<RefundPaymentResponse> {
    const { paymentFlowId } = refundPaymentInput

    const paymentFulfillment =
      await this.paymentFlowService.findPaymentFulfillmentForPaymentFlow(
        paymentFlowId,
      )

    if (paymentFulfillment?.paymentMethod === 'card') {
      return this.handleCardRefund(refundPaymentInput, paymentFulfillment)
    } else if (paymentFulfillment?.paymentMethod === 'invoice') {
      return this.handleInvoiceRefund(refundPaymentInput, paymentFulfillment)
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
}
