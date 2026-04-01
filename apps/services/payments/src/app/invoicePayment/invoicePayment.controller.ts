import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Query,
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
  InvoiceErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { environment } from '../../environments'
import { PaymentMethod } from '../../types'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { CallbackInput } from './dtos/callback.input'
import { CreateInvoiceInput } from './dtos/createInvoice.input'
import { CreateInvoiceResponse } from './dtos/createInvoice.response'
import { PaidStatus } from './dtos/paidStatus.enum'
import { InvoicePaymentService } from './invoicePayment.service'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisInvoicePaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments/invoice',
  version: ['1'],
})
export class InvoicePaymentController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly paymentFlowService: PaymentFlowService,
    private readonly invoicePaymentService: InvoicePaymentService,
  ) {}

  @Post('/create')
  @ApiOkResponse({
    type: CreateInvoiceResponse,
  })
  async create(
    @Body() createInvoiceInput: CreateInvoiceInput,
  ): Promise<CreateInvoiceResponse> {
    try {
      const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
        createInvoiceInput.paymentFlowId,
      )
      const [{ catalogItems }, { paymentStatus }] = await Promise.all([
        this.paymentFlowService.getPaymentFlowChargeDetails(
          paymentFlow.organisationId,
          paymentFlow.charges,
        ),
        this.paymentFlowService.getPaymentFlowStatus(paymentFlow),
      ])

      if (paymentStatus === 'paid') {
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }

      if (paymentStatus === 'invoice_pending') {
        throw new BadRequestException(InvoiceErrorCode.InvoiceAlreadyExists)
      }

      const callbackUrl = await this.invoicePaymentService.createCallbackUrl(
        paymentFlow.id,
      )

      const fjsConfirmation = await this.paymentFlowService.createFjsCharge(
        paymentFlow.id,
        generateChargeFJSPayload({
          paymentFlow,
          charges: catalogItems,
          systemId: environment.chargeFjs.systemId,
          returnUrl: callbackUrl,
        }),
      )

      await this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: createInvoiceInput.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.INVOICE,
        reason: 'payment_started',
        message: 'Invoice created',
        metadata: {
          charge: fjsConfirmation,
        },
      })

      return {
        correlationId: '',
        isSuccess: true,
      }
    } catch (e) {
      this.paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: createInvoiceInput.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.INVOICE,
        reason: 'payment_failed',
        message: `Failed to create charge in FJS: ${e.message}`,
      })

      throw new BadRequestException(
        onlyReturnKnownErrorCode(
          e.message,
          InvoiceErrorCode.UnknownInvoiceError,
        ),
      )
    }
  }

  @Post('/callback')
  async callback(
    @Body() callbackInput: CallbackInput,
    @Query('token') token: string,
  ) {
    if (
      callbackInput.status !== PaidStatus.paid &&
      callbackInput.status !== PaidStatus.recreatedAndPaid
    ) {
      this.logger.info(`Ignoring callback because status is not paid`, {
        status: callbackInput.status,
      })
      throw new BadRequestException(InvoiceErrorCode.UnsupportedCallbackStatus)
    }

    const { paymentFlowId } = await this.invoicePaymentService.validateCallback(
      callbackInput,
      token,
    )

    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      paymentFlowId,
    )

    const { paymentStatus } =
      await this.paymentFlowService.getPaymentFlowStatus(paymentFlow)

    if (paymentStatus === 'paid') {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    } else if (paymentStatus !== 'invoice_pending') {
      throw new BadRequestException(
        'Payment flow is not in invoice_pending status',
      )
    }

    await this.processInvoicePaymentConfirmation(paymentFlowId, callbackInput)

    await this.logInvoicePaymentSuccess(paymentFlowId, callbackInput)
  }

  /**
   * Processes the invoice payment confirmation with proper error handling.
   * This method handles the core business logic of creating the payment fulfillment.
   */
  private async processInvoicePaymentConfirmation(
    paymentFlowId: string,
    callbackInput: { receptionID: string },
  ): Promise<void> {
    try {
      await this.paymentFlowService.createInvoicePaymentConfirmation(
        paymentFlowId,
        callbackInput.receptionID,
      )
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] Failed to create invoice payment confirmation`,
        { error: error.message },
      )

      throw new BadRequestException(
        InvoiceErrorCode.FailedToCreateInvoiceConfirmation,
      )
    }
  }

  /**
   * Logs the successful invoice payment event.
   * This is separate from the core payment processing to allow for better error handling.
   * If logging fails, we still want the payment to be considered successful.
   */
  private async logInvoicePaymentSuccess(
    paymentFlowId: string,
    callbackInput: { receptionID: string },
  ): Promise<void> {
    try {
      await this.paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.INVOICE,
          reason: 'payment_completed',
          message: 'Invoice payment completed',
          metadata: {
            charge: {
              ...callbackInput,
              receptionId: callbackInput.receptionID,
            },
          },
        },
        {
          useRetry: true,
          throwOnError: true,
        },
      )
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] CRITICAL: Failed to log payment success event. Payment is confirmed but upstream notification failed.`,
        {
          error: error.message,
          stack: error.stack,
        },
      )

      // Failed notification event is already stored in the database with a failed delivery status
      // No additional storage needed, can be queried later for retry
    }
  }

  private async refundPaymentAndLogError(
    paymentFlowId: string,
    errorMessage: string,
  ): Promise<void> {
    // Refund the payment by deleting the FJS charge
    await this.paymentFlowService.deleteFjsCharge(paymentFlowId)

    await this.paymentFlowService.logPaymentFlowUpdate({
      paymentFlowId,
      type: 'error',
      occurredAt: new Date(),
      paymentMethod: PaymentMethod.INVOICE,
      reason: 'other',
      message: `Failed to create invoice payment confirmation`,
      metadata: {
        error: errorMessage,
      },
    })
  }
}
