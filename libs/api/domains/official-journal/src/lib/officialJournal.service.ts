import { OfficialJournalOfIcelandClientService } from '@island.is/clients/official-journal-of-iceland'
import { mapAdvertStatus } from './mapper'
import { Injectable } from '@nestjs/common'
import {
  AdvertQueryParams,
  QueryParams,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentResponse,
  AdvertInstitutionsResponse,
  AdvertMainCategoriesResponse,
  AdvertResponse,
  AdvertsResponse,
  AdvertTypeResponse,
} from './models/advert.response'

@Injectable()
export class OfficialJournalService {
  constructor(
    private readonly ojService: OfficialJournalOfIcelandClientService,
  ) {}

  async departments(params: QueryParams): Promise<AdvertDepartmentResponse> {
    return await this.ojService.departments(params)
  }

  async mainCategories(
    params: QueryParams,
  ): Promise<AdvertMainCategoriesResponse> {
    return await this.ojService.mainCategories(params)
  }

  async categories(params: QueryParams): Promise<AdvertCategoryResponse> {
    return await this.ojService.categories(params)
  }

  async types(params: TypeQueryParams): Promise<AdvertTypeResponse> {
    return await this.ojService.types(params)
  }

  async institutions(params: QueryParams): Promise<AdvertInstitutionsResponse> {
    return await this.ojService.institutions(params)
  }

  async advert(params: AdvertQueryParams): Promise<AdvertResponse> {
    const data = await this.ojService.advert(params)
    return {
      advert: {
        ...data,
        status: mapAdvertStatus(data.status),
      },
    }
  }

  async adverts(
    input: JournalControllerAdvertsRequest,
  ): Promise<AdvertsResponse> {
    const adverts = await this.ojService.adverts(input)

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
