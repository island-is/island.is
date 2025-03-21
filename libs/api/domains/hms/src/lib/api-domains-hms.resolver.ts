import { Query, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { HmsService } from '@island.is/clients/hms'
import { Audit } from '@island.is/nest/audit'
import { Addresses } from './models/hmsSearch.model'
import { HmsSearchInput } from './dto/hmsSearch.input'
import { HmsPropertyInfoInput } from './dto/hmsPropertyInfo.input'
import { PropertyInfos } from './models/hmsPropertyInfo.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/hms' })
export class HmsResolver {
  constructor(private hmsService: HmsService) {}

  @Query(() => Addresses, {
    name: 'hmsSearch',
    nullable: true,
  })
  @Audit()
  async getHmsSearch(
    @CurrentUser() user: User,
    @Args('input') input: HmsSearchInput,
  ): Promise<Addresses> {
    const addressesArray = await this.hmsService.hmsSearch(user, {
      ...input,
    })
    return { addresses: addressesArray }
  }

  @Query(() => PropertyInfos, {
    name: 'hmsPropertyInfo',
    nullable: true,
  })
  @Audit()
  async getHmsPropertyInfo(
    @CurrentUser() user: User,
    @Args('input') input: HmsPropertyInfoInput,
  ): Promise<PropertyInfos> {
    const propertyInfos = await this.hmsService.hmsPropertyInfo(user, {
      ...input,
    })
    return { propertyInfos }
  }
}
