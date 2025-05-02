import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'

import { ApiScope } from '@island.is/auth/scopes'
import { Query, Resolver } from '@nestjs/graphql'
import { UnionModel } from '../models/general/union.model'
import { SocialInsuranceService } from '../socialInsurance.service'
import { UseGuards } from '@nestjs/common'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class GeneralResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => [UnionModel])
  async siaGetUnions(@CurrentUser() user: User): Promise<UnionModel[]> {
    return this.service.getUnions(user)
  }
}
