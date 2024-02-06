import type { User } from '@island.is/auth-nest-tools'
import {
  DmrClientService,
  JournalControllerAdvertsRequest,
  JournalControllerTypesRequest,
} from '@island.is/clients/dmr'
import { AdvertsResponse } from './models/responses'
import { Advert } from './models/advert.model'
import { mapAdvertStatus } from './mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MinistryOfJusticeService {
  constructor(private readonly dmrService: DmrClientService) {}

  async departments(auth: User) {
    return await this.dmrService.departments(auth)
  }

  async types(auth: User, params: JournalControllerTypesRequest) {
    return await this.dmrService.types(auth, params)
  }

  async adverts(
    auth: User,
    input: JournalControllerAdvertsRequest,
  ): Promise<AdvertsResponse> {
    const adverts = await this.dmrService.adverts(auth, input)

    const mappedAdverts: Array<Advert> = adverts.adverts.map((advert) => {
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
