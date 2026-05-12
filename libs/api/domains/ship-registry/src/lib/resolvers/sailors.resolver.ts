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
import { ShipRegistrySailorCertificates } from '../models/sailorCertificates.model'
import { SailorsService } from '../services/sailors.service'

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
}
