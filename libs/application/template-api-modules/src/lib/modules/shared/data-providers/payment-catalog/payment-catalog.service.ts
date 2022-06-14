import { PaymentCatalogItem } from '@island.is/application/core'

import { TemplateApiModuleActionProps } from '../../../../types'
import { PaymentAPI } from '@island.is/clients/payment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PaymentCatalogService {
  constructor(private paymentClientApi: PaymentAPI) {}

  async paymentCatalog({
    params,
  }: TemplateApiModuleActionProps): Promise<PaymentCatalogItem[]> {
    const organizationId = params?.organizationId as string

    const data = await (organizationId
      ? this.paymentClientApi.getCatalogByPerformingOrg(organizationId)
      : await this.paymentClientApi.getCatalog())

    return data.item
  }
}
