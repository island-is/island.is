import { Resolver, Query } from '@nestjs/graphql'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver()
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => NationalRegistryPerson, { nullable: true })
  async getChildrenCustodyAndParents(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryPerson | undefined> {
    return await this.nationalRegistryXRoadService.getCustodyChildrenAndParents(
      user.nationalId,
      user.authorization,
    )
  }
}
