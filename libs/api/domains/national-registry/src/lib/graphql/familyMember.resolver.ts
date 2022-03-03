import { UseGuards } from '@nestjs/common'
import { Query,Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryService } from '../nationalRegistry.service'
import { FamilyMember } from '../types'

import { NationalRegistryFamilyMember } from './models'

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
