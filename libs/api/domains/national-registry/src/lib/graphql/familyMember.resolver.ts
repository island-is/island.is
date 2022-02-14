import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryFamilyMember } from './models'
import { NationalRegistryService } from '../nationalRegistry.service'
import { FamilyMember } from '../types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryFamilyMember)
@Audit({ namespace: '@island.is/api/national-registry' })
export class FamilyMemberResolver {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Query(() => [NationalRegistryFamilyMember], {
    name: 'nationalRegistryFamily',
    nullable: true,
  })
  @Audit()
  getMyFamily(@CurrentUser() user: AuthUser): Promise<FamilyMember[]> {
    return this.nationalRegistryService.getFamily(user.nationalId)
  }
}
