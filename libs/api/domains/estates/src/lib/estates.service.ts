import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { EstatesClientService } from '@island.is/clients/estates'
import { mapToEstateCollection } from './mapper'
import { EstatesEstatesCollection } from './models/estatesCollection.model'

@Injectable()
export class EstatesDomainService {
  constructor(
    private readonly estatesClientService: EstatesClientService,
  ) {}

  async getEstates(user: User): Promise<EstatesEstatesCollection> {
    const data = await this.estatesClientService.getEstates(user)
    const mapped = mapToEstateCollection(data)
    return {
      data: mapped,
      totalCount: mapped.length,
      pageInfo: { hasNextPage: false },
    }
  }
}
