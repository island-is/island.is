import { Injectable } from '@nestjs/common'
import { ApiCatalogue } from './models/catalogue.model'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

@Injectable()
export class ApiCatalogueService {
  private catalogues: ApiCatalogue[] = [
    {
      id: '1',
      owner: 'First service owner',
      serviceName: 'FirstService',
      description: 'First service description',
      url: 'www.firstService.is',
      pricing: PricingCategory.FREE,
      data: DataCategory.HEALTH,
      type: TypeCategory.SOAP,
      access: AccessCategory.APIGW,
    },
    {
      id: '2',
      owner: 'Second service owner',
      serviceName: 'SecondService',
      description: 'Second service description',
      url: 'www.secondService.is',
      pricing: PricingCategory.MONTHLY,
      data: DataCategory.PERSONAL,
      type: TypeCategory.REST,
      access: AccessCategory.XROAD,
    },
  ]

  getCatalogues(): ApiCatalogue[] {
    return this.catalogues
  }

  getCatalogueById(id: string): ApiCatalogue {
    return this.catalogues.find((c) => c.id === id)
  }
}
