import { Injectable } from '@nestjs/common'
import { ApiCatalogue, ApiService } from './models/catalogue.model'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { GetApiCataloguesInput } from './dto/catalogue.input'

@Injectable()
export class ApiCatalogueService {
  private catalogues: ApiCatalogue = {
    services: [
      {
        id: '1',
        owner: 'First service owner',
        name: 'FirstService',
        description: 'First service description',
        url: 'www.firstService.is',
        pricing: PricingCategory.FREE,
        data: [DataCategory.HEALTH],
        type: TypeCategory.SOAP,
        access: [AccessCategory.APIGW],
        created: new Date(),
        updated: new Date(),
      },
      {
        id: '2',
        owner: 'Second service owner',
        name: 'SecondService',
        description: 'Second service description',
        url: 'www.secondService.is',
        pricing: PricingCategory.MONTHLY,
        data: [DataCategory.PERSONAL],
        type: TypeCategory.REST,
        access: [AccessCategory.XROAD],
        created: new Date(),
      },
      {
        id: '3',
        owner: 'Third service owner',
        name: 'ThirdService',
        description: 'Third service description',
        url: 'www.ThirdService.is',
        pricing: PricingCategory.MONTHLY,
        data: [DataCategory.PERSONAL],
        type: TypeCategory.REST,
        access: [AccessCategory.XROAD],
        created: new Date(),
      },
      {
        id: '4',
        owner: 'Fourth service owner',
        name: 'FourthService',
        description: 'Fourth service description',
        url: 'www.FourthService.is',
        pricing: PricingCategory.MONTHLY,
        data: [DataCategory.PERSONAL],
        type: TypeCategory.REST,
        access: [AccessCategory.XROAD],
        created: new Date(),
        updated: new Date(),
      },
      {
        id: '5',
        owner: 'Fifth service owner',
        name: 'FifthService',
        description: 'Fifth service description',
        url: 'www.FifthService.is',
        pricing: PricingCategory.MONTHLY,
        data: [DataCategory.PERSONAL],
        type: TypeCategory.REST,
        access: [AccessCategory.XROAD],
        created: new Date(),
      },
      {
        id: '6',
        owner: 'Sixth service owner',
        name: 'SixthService',
        description: 'Sixth service description',
        url: 'www.sixthService.is',
        pricing: PricingCategory.MONTHLY,
        data: [DataCategory.PERSONAL],
        type: TypeCategory.REST,
        access: [AccessCategory.XROAD],
        created: new Date(),
        updated: new Date(),
      },
    ],
  }

  getCatalogues(input: GetApiCataloguesInput): ApiCatalogue {
    if (input.cursor !== null) {
      //find the next objects
    } else {
      //find limit number of objects
    }

    return this.catalogues
  }

  getCatalogueById(id: string): ApiService {
    return this.catalogues.services.find((c) => c.id === id)
  }
}
