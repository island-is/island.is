import { Injectable } from '@nestjs/common'
import {
  ApiCatalogue,
  AccessCategoryEnum,
  DataCategoryEnum,
  TypeCategoryEnum,
  PricingCategoryEnum,
} from './dto/catalogue.dto'

@Injectable()
export class ApiCatalogueService {
  private catalogues: ApiCatalogue[] = [
    {
      id: '1',
      owner: 'First service owner',
      serviceName: 'FirstService',
      description: 'First service description',
      url: 'www.firstService.is',
      pricing: PricingCategoryEnum.FREE,
      data: DataCategoryEnum.HEALTH,
      type: TypeCategoryEnum.SOAP,
      access: AccessCategoryEnum.APIGW,
    },
    {
      id: '2',
      owner: 'Second service owner',
      serviceName: 'SecondService',
      description: 'Second service description',
      url: 'www.secondService.is',
      pricing: PricingCategoryEnum.MONTHLY,
      data: DataCategoryEnum.PERSONAL,
      type: TypeCategoryEnum.REST,
      access: AccessCategoryEnum.XROAD,
    },
  ]

  getCatalogues(): ApiCatalogue[] {
    return this.catalogues
  }
}
