import {
  CreateChargeParameters,
  PaymentCatalogItem,
  PaymentCatalogParameters,
} from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { PaymentService as PaymentModelService } from '@island.is/application/api/payment'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class PaymentService extends BaseTemplateApiService {
  constructor(
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly paymentModelService: PaymentModelService,
  ) {
    super('Payment')
  }

  async paymentCatalog({
    params,
  }: TemplateApiModuleActionProps<PaymentCatalogParameters>): Promise<
    PaymentCatalogItem[]
  > {
    if (!params?.organizationId) {
      throw Error('Missing performing organization ID')
    }

    const data = await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
      params.organizationId,
    )

    return data.item
  }

  async createCharge({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const { organizationId, chargeItemCodes, extraData } = params ?? {}

    if (!organizationId) throw Error('Missing performing organization ID')
    if (!chargeItemCodes) throw Error('No selected charge item code')

    const codes =
      typeof chargeItemCodes === 'function'
        ? chargeItemCodes(application)
        : chargeItemCodes

    const extraDataItems =
      typeof extraData === 'function' ? extraData(application) : extraData ?? []

    const response = await this.paymentModelService.createCharge(
      auth,
      organizationId,
      codes,
      application.id,
      extraDataItems,
    )

    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }
    return response
  }

  async verifyPayment({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const paymentStatus = await this.paymentModelService.getStatus(
      auth,
      application.id,
    )

    if (paymentStatus?.fulfilled !== true) {
      throw new TemplateApiError(
        {
          title: 'Payment not completed',
          description:
            'Ekki er hægt að halda áfram umsókn af því að ekki hefur tekist að taka við greiðslu.',
        },
        500,
      )
    }
  }

  async deletePayment({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    console.log('deleting Payment for application ', application.id)

    const payment = await this.paymentModelService.findPaymentByApplicationId(
      application.id,
    )

    if (!payment) {
      throw new TemplateApiError(
        {
          title: 'Payment not found',
          description: 'Ekki hægt að eyða greiðslu sem finnst ekki.',
        },
        500,
      )
    }

    const s = await this.chargeFjsV2ClientService.deleteCharge(payment.id)
    console.log('deleteCharge response : ', s)
    const paymentStatus = await this.paymentModelService.delete(
      application.id,
      auth,
    )
  }
}
