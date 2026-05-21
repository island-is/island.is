import { Query, Resolver } from '@nestjs/graphql'
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
import { EstatesEstate } from './models/estate.model'
import { EstatesEstatesCollection } from './models/estatesCollection.model'
import { EstatesDomainService } from './estates.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.estates)
@FeatureFlag(Features.isServicePortalEstatesEnabled)
@Audit({ namespace: '@island.is/api/estates' })
@Resolver(() => EstatesEstate)
export class EstatesResolver {
  constructor(private readonly estatesService: EstatesDomainService) {}

  @Query(() => EstatesEstatesCollection, {
    name: 'getEstates',
    nullable: true,
  })
  async estates(@CurrentUser() user: User): Promise<EstatesEstatesCollection> {
    return this.estatesService.getEstates(user)
  }
}
