import { Resolver, Query } from '@nestjs/graphql'
import { NationalRegistryXRoadService } from './national-registry-x-road.service'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ChildrenCustodyResponse } from '../models/childrenCustodyResponse.model'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver()
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => ChildrenCustodyResponse, { nullable: true })
  async getChildrenCustodyAndParents(
    @CurrentUser() user: User,
  ): Promise<ChildrenCustodyResponse | undefined> {
    return await this.nationalRegistryXRoadService.getCustodyChildrenAndParents(
      user.nationalId,
      user.authorization,
    )
  }
}
