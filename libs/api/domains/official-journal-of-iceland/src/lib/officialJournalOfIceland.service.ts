import {
  JournalControllerAdvertsRequest,
  OfficialJournalOfIcelandClientService,
} from '@island.is/clients/official-journal-of-iceland'
import { mapAdvertStatus } from './mapper'
import { Injectable } from '@nestjs/common'
import {
  AdvertSingleParams,
  QueryParams,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentsResponse,
  AdvertInstitutionsResponse,
  AdvertMainCategoriesResponse,
  AdvertResponse,
  AdvertsResponse,
  AdvertTypesResponse,
} from './models/advert.response'

@Injectable()
export class OfficialJournalOfIcelandService {
  constructor(
    private readonly ojoiService: OfficialJournalOfIcelandClientService,
  ) {}

  async department(params: AdvertSingleParams) {
    return await this.ojoiService.department(params)
  }

  async departments(params: QueryParams): Promise<AdvertDepartmentsResponse> {
    return await this.ojoiService.departments(params)
  }

  async mainCategories(
    params: QueryParams,
  ): Promise<AdvertMainCategoriesResponse> {
    return await this.ojoiService.mainCategories(params)
  }

  async categories(params: QueryParams): Promise<AdvertCategoryResponse> {
    return await this.ojoiService.categories(params)
  }

  async type(params: AdvertSingleParams) {
    return await this.ojoiService.type(params)
  }

  async types(params: TypeQueryParams): Promise<AdvertTypesResponse> {
    return await this.ojoiService.types(params)
  }

  async institutions(params: QueryParams): Promise<AdvertInstitutionsResponse> {
    return await this.ojoiService.institutions(params)
  }

  async advert(params: AdvertSingleParams): Promise<AdvertResponse> {
    const { advert } = await this.ojoiService.advert(params)
    return {
      advert: {
        ...advert,
        status: mapAdvertStatus(advert.status),
      },
    }
  }

  async adverts(
    input: JournalControllerAdvertsRequest,
  ): Promise<AdvertsResponse> {
    const adverts = await this.ojoiService.adverts(input)

    const mappedAdverts = adverts.adverts.map((advert) => {
      return {
        ...advert,
        status: mapAdvertStatus(advert.status),
      }
    })

    const response: AdvertsResponse = {
      adverts: mappedAdverts,
      paging: adverts.paging,
    }

    return response
  }
}
