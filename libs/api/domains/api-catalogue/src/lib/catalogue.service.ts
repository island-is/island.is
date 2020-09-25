import { Injectable } from '@nestjs/common'
import { ApiCatalogue, ApiService } from './models/catalogue.model'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { GetApiCataloguesInput } from './dto/catalogue.input'
import { ElasticService } from '@island.is/api-catalogue/elastic'

@Injectable()
export class ApiCatalogueService {
  constructor(private repository: ElasticService) {}
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
        pricing: PricingCategory.FREE,
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
        pricing: PricingCategory.PAID,
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
        pricing: PricingCategory.PAID,
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
        pricing: PricingCategory.FREE,
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
        pricing: PricingCategory.PAID,
        data: [DataCategory.PERSONAL],
        type: TypeCategory.REST,
        access: [AccessCategory.XROAD],
        created: new Date(),
        updated: new Date(),
      },
    ],
  }

  async getCatalogues(input: GetApiCataloguesInput): Promise<ApiCatalogue> {
    const res: ApiCatalogue = {
      services: [],
      pageInfo: {
        nextCursor: null,
      },
    }

    let item: ApiService[] = this.catalogues.services
    if (input.cursor !== null) {
      const temp = Buffer.from(input.cursor, 'base64')
        .toString()
        .split('=')
      const field = temp[0]
      const id = temp[1]
      const index = item.findIndex((c) => c[field] === id)
      item = item.slice(index)
    }

    //find limit number of objects, ask for one extra for cursor
    item = item.slice(0, input.limit + 1)

    //only set the cursor when we have the extra item to point to
    if (item.length > input.limit) {
      res.pageInfo.nextCursor = Buffer.from(
        `id=${item[item.length - 1].id}`,
      ).toString('base64')
    }
    res.services = item.slice(0, input.limit)

    return res
  }

  async getCatalogueById(id: string): Promise<ApiCatalogue> {
    const res: ApiCatalogue = {
      services: [],
    }

    const item: ApiService = this.catalogues.services.find((c) => c.id === id)

    if (item) {
      res.services = [item]
    }

    return res
  }
}
