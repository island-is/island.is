import { PaymentCatalogItem } from '@island.is/application/types'

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
  }: TemplateApiModuleActionProps): Promise<PaymentCatalogItem[]> {
    const parameters = params as { organizationId: string }

    const data = await (parameters
      ? this.paymentClientApi.getCatalogByPerformingOrg(
          parameters.organizationId,
        )
      : this.paymentClientApi.getCatalog())

    return data.item
  }
}
