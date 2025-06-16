import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

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
import { PaymentMethod } from '../../types'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import { environment } from '../../environments'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments/invoice',
  version: ['1'],
})
export class InvoicePaymentController {
  constructor(private readonly paymentFlowService: PaymentFlowService) {}

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

      const fjsConfirmation = await this.paymentFlowService.createPaymentCharge(
        paymentFlow.id,
        generateChargeFJSPayload({
          paymentFlow,
          charges: catalogItems,
          totalPrice,
          systemId: environment.chargeFjs.systemId,
          returnUrl: '', // TODO
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
}
