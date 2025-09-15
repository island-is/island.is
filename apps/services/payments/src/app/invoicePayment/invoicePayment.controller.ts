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
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  InvoiceErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { CreateInvoiceResponse } from './dtos/createInvoice.response'
import { CreateInvoiceInput } from './dtos/createInvoice.input'
import { CallbackInput } from './dtos/callback.input'
import { PaidStatus } from './dtos/paidStatus.enum'
import { PaymentMethod } from '../../types'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import { environment } from '../../environments'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
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
      const [{ catalogItems, totalPrice }, { paymentStatus }] =
        await Promise.all([
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
          totalPrice,
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
      return
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

    if (paymentStatus !== 'invoice_pending') {
      throw new BadRequestException(
        'Payment flow is not in invoice_pending status',
      )
    }

    await this.paymentFlowService.createInvoicePaymentConfirmation(
      paymentFlowId,
      callbackInput.receptionID,
    )

    // TODO extract this to a method
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
            payment: callbackInput,
          },
        },
        {
          useRetry: true,
          throwOnError: true,
        },
      )
    } catch (e) {
      await this.paymentFlowService.deletePaymentCharge(paymentFlowId)
      // Refund the payment by deleting the FJS charge
    }
  }
}
