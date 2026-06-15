import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { LocaleEnum } from '@island.is/nest/graphql'
import { EstatesClientService } from '@island.is/clients/estates'
import { mapToEstateCollection, mapToEstatesCase } from './mapper'
import { EstatesCollection } from './models/estatesCollection.model'
import { EstateCase } from './models/case.model'

@Injectable()
export class EstatesDomainService {
  constructor(private readonly estatesClientService: EstatesClientService) {}

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
    return mapToEstatesCase(data, locale)
  }
}
