import { UseGuards } from '@nestjs/common'
import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
  Args,
} from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  GetRealEstateInput,
  GetPagingTypes,
} from '../dto/getRealEstateInput.input'
import { AssetsXRoadService } from './api-domains-assets.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/assets' })
export class AssetsXRoadResolver {
  constructor(private assetsXRoadService: AssetsXRoadService) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstates(@CurrentUser() user: User) {
    return this.assetsXRoadService.getRealEstates(user)
  }

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstateDetail(
    @Args('input') input: GetRealEstateInput,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getRealEstateDetail(input.assetId, user)
  }

  @Query(() => graphqlTypeJson)
  @Audit()
  async getThinglystirEigendur(
    @Args('input') input: GetPagingTypes,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getThinglystirEigendur(
      input.assetId,
      user,
      input.cursor,
      input.limit,
    )
  }
}
