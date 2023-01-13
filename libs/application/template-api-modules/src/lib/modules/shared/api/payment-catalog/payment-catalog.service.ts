import {
  PaymentCatalogItem,
  PaymentCatalogParameters,
} from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'

@Injectable()
export class PaymentCatalogService extends BaseTemplateApiService {
  constructor(private chargeFjsV2ClientService: ChargeFjsV2ClientService) {
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
}
