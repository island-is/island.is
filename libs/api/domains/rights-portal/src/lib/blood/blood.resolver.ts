import { Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import { BloodType } from './models/bloodType.model'
import { BloodService } from './blood.service'

@Resolver(() => BloodType)
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/rights-portal/blood' })
export class BloodResolver {
  constructor(private readonly service: BloodService) {}

  @Scopes(ApiScope.internal, ApiScope.health)
  @Query(() => BloodType, {
    name: 'rightsPortalBloodType',
    nullable: true,
  })
  @Audit()
  async getRightsPortalBloodType(@CurrentUser() user: User) {
    return this.service.getBloodType(user)
  }
}
