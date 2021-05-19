import { Resolver, Query } from '@nestjs/graphql'
import { NationalRegistryXRoadService } from './national-registry-x-road.service'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { NationalRegistry } from '@island.is/application/templates/family-matters-core/types'
import { ChildrenCustody } from '../models/ChildrenCustody'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver()
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => ChildrenCustody, { nullable: true })
  async getChildrenCustodyAndParents(
    @CurrentUser() user: User,
  ): Promise<NationalRegistry | undefined> {
    return await this.nationalRegistryXRoadService.getCustodyChildrenAndParents(
      user.nationalId,
      user.authorization,
    )
  }
}
