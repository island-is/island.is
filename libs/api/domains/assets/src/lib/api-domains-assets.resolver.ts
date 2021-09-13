import { Query, Resolver, Args } from '@nestjs/graphql'
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
import { GetRealEstateInput } from '../dto/getRealEstateInput.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/assets' })
export class AssetsResolver {
  constructor(private AssetService: AssetService) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstates(@CurrentUser() user: User) {
    return this.AssetService.getRealEstates()
  }

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstateDetail(@Args('input') input: GetRealEstateInput) {
    return this.AssetService.getRealEstateDetail(input.assetId)
  }
}
