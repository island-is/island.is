import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { UnionModel } from '../models/general/union.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class GeneralResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => [UnionModel], { name: 'socialInsuranceUnions' })
  async siaGetUnions(@CurrentUser() user: User) {
    return this.service.getUnions(user)
  }
}
