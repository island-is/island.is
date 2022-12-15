import {
  PaymentCatalogItem,
  PaymentCatalogParameters,
} from '@island.is/application/types'

import { TemplateApiModuleActionProps } from '../../../../types'
import { PaymentAPI } from '@island.is/clients/payment'
import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'

@Injectable()
export class PaymentCatalogService extends BaseTemplateApiService {
  constructor(private paymentClientApi: PaymentAPI) {
    super('PaymentCatalog')
  }

  async paymentCatalog({
    params,
  }: TemplateApiModuleActionProps<PaymentCatalogParameters>): Promise<
    PaymentCatalogItem[]
  > {
    const data = await (params
      ? this.paymentClientApi.getCatalogByPerformingOrg(params.orginizationId)
      : this.paymentClientApi.getCatalog())

    return data.item
  }
}
