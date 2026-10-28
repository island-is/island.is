import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { LocaleEnum } from '@island.is/nest/graphql'
import { CodeOwners } from '@island.is/shared/constants'

import { CaseInput } from './dto/case.input'
import { EstateCase } from './models/case.model'
import { Estate } from './models/estate.model'
import { EstatesCollection } from './models/estatesCollection.model'
import { EstatesDomainService } from './estates.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.estates)
@FeatureFlag(Features.isServicePortalEstatesEnabled)
@Audit({ namespace: '@island.is/api/estates' })
@Resolver(() => Estate)
export class EstatesResolver {
  constructor(private readonly estatesService: EstatesDomainService) {}

  @Query(() => EstatesCollection, {
    name: 'estates',
    nullable: true,
  })
  async estates(@CurrentUser() user: User): Promise<EstatesCollection> {
    return this.estatesService.getEstates(user)
  }

  @Query(() => EstateCase, {
    name: 'estate',
    nullable: true,
  })
  async estate(
    @CurrentUser() user: User,
    @Args('input') input: CaseInput,
  ): Promise<EstateCase | null> {
    return this.estatesService.getEstateCase(
      user,
      input.caseId,
      input.locale ?? LocaleEnum.Is,
    )
  }
}
