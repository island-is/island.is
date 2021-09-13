import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'
import { AssetService } from '@island.is/clients/assets'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/assets' })
export class AssetsResolver {
  constructor(private AssetService: AssetService) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstate(@CurrentUser() user: User) {
    return this.AssetService.getRealEstate()
  }
}
