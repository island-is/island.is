import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'

import type { User } from '@island.is/auth-nest-tools'
import { EstatesClientService } from '@island.is/clients/estates'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { LocaleEnum } from '@island.is/nest/graphql'

import { EstateCase } from './models/case.model'
import { EstatesCollection } from './models/estatesCollection.model'
import { mapToEstateCollection, mapToEstatesCase } from './mapper'

@Injectable()
export class EstatesDomainService {
  constructor(
    private readonly estatesClientService: EstatesClientService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  async getEstates(user: User): Promise<EstatesCollection> {
    const data = await this.estatesClientService.getEstates(user)
    const mapped = mapToEstateCollection(data)
    return {
      data: mapped,
      totalCount: mapped.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getEstateCase(
    user: User,
    caseId: string,
    locale: LocaleEnum,
  ): Promise<EstateCase | null> {
    const data = await this.estatesClientService.getEstateCase(user, caseId)
    if (!data) return null
    return mapToEstatesCase(data, locale, this.downloadServiceConfig.baseUrl)
  }
}
