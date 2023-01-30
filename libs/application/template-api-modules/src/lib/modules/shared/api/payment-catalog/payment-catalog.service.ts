import {
  CreateChargeParameters,
  PaymentCatalogItem,
  PaymentCatalogParameters,
} from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  ChargeFjsV2ClientService,
  ExtraData,
} from '@island.is/clients/charge-fjs-v2'
import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { PaymentService } from '@island.is/application/api/payment'

@Injectable()
export class PaymentCatalogService extends BaseTemplateApiService {
  constructor(
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly paymentService: PaymentService,
  ) {
    super('PaymentCatalog')
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

    const response = await this.paymentService.createCharge(
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
}
