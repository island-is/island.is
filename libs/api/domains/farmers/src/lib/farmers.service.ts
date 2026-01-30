import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { FarmersClientService } from '@island.is/clients/farmers'
import { FarmerLandsCollection } from './models/farmerLandsCollection.model'
import { mapToFarmerLandCollection } from './mapper'

@Injectable()
export class FarmersService {
  constructor(private readonly farmersClientService: FarmersClientService) {}

  async getList(user: User): Promise<FarmerLandsCollection> {
    const data = await this.farmersClientService.getFarmsCollection(user)
    return {
      data: mapToFarmerLandCollection(data),
      totalCount: data.length,
      pageInfo: { hasNextPage: false },
    }
  }
}
