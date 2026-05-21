import { Args, InputType, Field, Float, Int, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { ShipRegistrySailorCertificates } from '../models/sailorCertificates.model'
import { ShipRegistrySailorSeaServiceEntry } from '../models/sailorSeaServiceEntry.model'
import { ShipRegistryRank } from '../models/rank.model'
import { SailorsService } from '../services/sailors.service'

@InputType()
export class ShipRegistrySeaServiceFilterInput {
  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field(() => Int, { nullable: true })
  rankId?: number

  @Field(() => Float, { nullable: true })
  fromOrEqLength?: number

  @Field(() => Float, { nullable: true })
  fromOrEqMainEnginePower?: number

  @Field(() => Float, { nullable: true })
  fromOrEqBruttoWeight?: number
}

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.ships)
@FeatureFlag(Features.isServicePortalSailorsPageEnabled)
@Audit({ namespace: '@island.is/api/ship-registry' })
@Resolver(() => ShipRegistrySailorCertificates)
export class SailorsResolver {
  constructor(private readonly sailorsService: SailorsService) {}

  @Query(() => ShipRegistrySailorCertificates, {
    name: 'shipRegistrySailorCertificates',
    nullable: true,
  })
  async sailorCertificates(
    @CurrentUser() user: User,
  ): Promise<ShipRegistrySailorCertificates | null> {
    return this.sailorsService.getSailorCertificates(user)
  }

  @Query(() => [ShipRegistrySailorSeaServiceEntry], {
    name: 'shipRegistrySailorSeaService',
  })
  async sailorSeaService(
    @Args('filters', { nullable: true })
    filters?: ShipRegistrySeaServiceFilterInput,
  ): Promise<ShipRegistrySailorSeaServiceEntry[]> {
    return this.sailorsService.getSailorSeaService(
      filters
        ? {
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            rankId: filters.rankId,
            fromOrEqLength: filters.fromOrEqLength,
            fromOrEqMainEnginePower: filters.fromOrEqMainEnginePower,
            fromOrEqBruttoWeight: filters.fromOrEqBruttoWeight,
          }
        : undefined,
    )
  }

  @Query(() => [ShipRegistryRank], {
    name: 'shipRegistryRanks',
  })
  async ranks(): Promise<ShipRegistryRank[]> {
    return this.sailorsService.getRanks()
  }
}
