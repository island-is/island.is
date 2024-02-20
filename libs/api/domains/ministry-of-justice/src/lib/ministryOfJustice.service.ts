import type { User } from '@island.is/auth-nest-tools'
import {
  DmrClientService,
  JournalControllerAdvertsRequest,
} from '@island.is/clients/dmr'
import { mapAdvertStatus } from './mapper'
import { Injectable } from '@nestjs/common'
import {
  QueryParams,
  SubmitApplicationInput,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentResponse,
  AdvertResponse,
  AdvertTypeResponse,
} from './models/advert.response'

@Injectable()
export class MinistryOfJusticeService {
  constructor(private readonly dmrService: DmrClientService) {}

  async departments(
    auth: User,
    params: QueryParams,
  ): Promise<AdvertDepartmentResponse> {
    return await this.dmrService.departments(auth, params)
  }

  async categories(
    auth: User,
    params: QueryParams,
  ): Promise<AdvertCategoryResponse> {
    return await this.dmrService.categories(auth, params)
  }

  async types(
    auth: User,
    params: TypeQueryParams,
  ): Promise<AdvertTypeResponse> {
    return await this.dmrService.types(auth, params)
  }

  async adverts(
    auth: User,
    input: JournalControllerAdvertsRequest,
  ): Promise<AdvertResponse> {
    const adverts = await this.dmrService.adverts(auth, input)

    const mappedAdverts = adverts.adverts.map((advert) => {
      return {
        ...advert,
        status: mapAdvertStatus(advert.status),
      }
    })

    const response: AdvertResponse = {
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
