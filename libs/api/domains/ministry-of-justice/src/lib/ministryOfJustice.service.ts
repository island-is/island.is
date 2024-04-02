import type { User } from '@island.is/auth-nest-tools'
import {
  DmrClientService,
  JournalControllerAdvertsRequest,
} from '@island.is/clients/dmr'
import { mapAdvertStatus } from './mapper'
import { Injectable } from '@nestjs/common'
import {
  AdvertQueryParams,
  QueryParams,
  SubmitApplicationInput,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentResponse,
  AdvertInvolvedPartiesResponse,
  AdvertMainCategoriesResponse,
  AdvertResponse,
  AdvertsResponse,
  AdvertTypeResponse,
} from './models/advert.response'

@Injectable()
export class MinistryOfJusticeService {
  constructor(private readonly dmrService: DmrClientService) {}

  async departments(params: QueryParams): Promise<AdvertDepartmentResponse> {
    return await this.dmrService.departments(params)
  }

  async mainCategories(
    params: QueryParams,
  ): Promise<AdvertMainCategoriesResponse> {
    return await this.dmrService.mainCategories(params)
  }

  async categories(params: QueryParams): Promise<AdvertCategoryResponse> {
    return await this.dmrService.categories(params)
  }

  async types(params: TypeQueryParams): Promise<AdvertTypeResponse> {
    return await this.dmrService.types(params)
  }

  async involvedParties(
    params: QueryParams,
  ): Promise<AdvertInvolvedPartiesResponse> {
    return await this.dmrService.involvedParties(params)
  }

  async advert(params: AdvertQueryParams): Promise<AdvertResponse> {
    const data = await this.dmrService.advert(params)
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
    const adverts = await this.dmrService.adverts(input)

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

  async submitApplication(auth: User, input: SubmitApplicationInput) {
    return await this.dmrService.submitApplication(auth, {
      journalPostApplicationBody: input,
    })
  }
}
