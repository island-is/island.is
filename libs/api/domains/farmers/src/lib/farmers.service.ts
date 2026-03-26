import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { FarmersClientService } from '@island.is/clients/farmers'
import { isDefined } from '@island.is/shared/utils'
import {
  mapToFarmerLand,
  mapToFarmerLandCollection,
  mapToFarmerLandSubsidy,
  mapToLandBeneficiary,
  mapToLandRegistryEntry,
} from './mapper'
import { FarmerLand } from './models/farmerLand.model'
import { FarmerLandSubsidiesCollection } from './models/farmerLandSubsidiesCollection.model'
import {
  FarmerLandSubsidyOrderDirection,
  FarmerLandSubsidyOrderField,
} from './models/enums'
import { LandBeneficiary } from './models/landBeneficiary.model'
import { LandRegistryEntry } from './models/landRegistryEntry.model'
import { LandsCollection } from './models/farmerLandsCollection.model'

@Injectable()
export class FarmersService {
  constructor(private readonly farmersClientService: FarmersClientService) {}

  async getList(user: User): Promise<LandsCollection> {
    const data = await this.farmersClientService.getFarmsCollection(user)
    return {
      data: mapToFarmerLandCollection(data),
      totalCount: data.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getLand(user: User, id: string): Promise<FarmerLand | null> {
    const farm = await this.farmersClientService.getFarm(user, id)
    return farm ? mapToFarmerLand(farm) ?? null : null
  }

  async getBeneficiaries(
    user: User,
    farmId: string,
  ): Promise<LandBeneficiary[]> {
    const data = await this.farmersClientService.getFarmBeneficiaries(
      user,
      farmId,
    )
    return data.map(mapToLandBeneficiary).filter(isDefined)
  }

  async getLandRegistry(
    user: User,
    farmId: string,
  ): Promise<LandRegistryEntry[]> {
    const data = await this.farmersClientService.getFarmAssets(user, farmId)
    return data.map(mapToLandRegistryEntry).filter(isDefined)
  }

  async getSubsidies(
    user: User,
    farmId: string,
    cursor?: string,
    orderField?: FarmerLandSubsidyOrderField,
    orderDirection?: FarmerLandSubsidyOrderDirection,
  ): Promise<FarmerLandSubsidiesCollection> {
    const order = orderField
      ? `${orderDirection === FarmerLandSubsidyOrderDirection.Descending ? '-' : '+'}${orderField}`
      : undefined

    const response = await this.farmersClientService.getFarmPayments(
      user,
      farmId,
      cursor,
      order,
    )
    return {
      data: (response?.data ?? [])
        .map((p) => mapToFarmerLandSubsidy(p, farmId))
        .filter(isDefined),
      totalCount: response?.total ?? 0,
      pageInfo: {
        hasNextPage: !!response?.next,
        hasPreviousPage: !!response?.previous,
        startCursor: response?.previous ?? undefined,
        endCursor: response?.next ?? undefined,
      },
    }
  }
}
