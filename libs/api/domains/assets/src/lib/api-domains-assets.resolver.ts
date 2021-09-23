import { UseGuards } from '@nestjs/common'
import { Query, Args } from '@nestjs/graphql'
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
  GetMultiPropertyInput,
} from '../dto/getRealEstateInput.input'
import { PropertyOwnersModel } from '../models/propertyOwners.model'
import { UnitsOfUseModel } from '../models/propertyUnitsOfUse.model'
import { AssetsXRoadService } from './api-domains-assets.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/assets' })
export class AssetsXRoadResolver {
  constructor(private assetsXRoadService: AssetsXRoadService) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstates(
    @Args('input') input: GetMultiPropertyInput,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getRealEstates(
      user,
      input.cursor,
      input.limit,
    )
  }

  @Query(() => graphqlTypeJson)
  @Audit()
  async getRealEstateDetail(
    @Args('input') input: GetRealEstateInput,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getRealEstateDetail(input.assetId, user)
  }

  @Query(() => PropertyOwnersModel, { nullable: true })
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

  @Query(() => UnitsOfUseModel, { nullable: true })
  @Audit()
  async getNotkunareiningar(
    @Args('input') input: GetPagingTypes,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getUnitsOfUse(
      input.assetId,
      user,
      input.cursor,
      input.limit,
    )
  }
}
