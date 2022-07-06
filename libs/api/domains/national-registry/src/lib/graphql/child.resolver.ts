import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryChild } from './models'
import { NationalRegistryService } from '../nationalRegistry.service'
import { FamilyChild } from '../types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryChild)
@Audit({ namespace: '@island.is/api/national-registry' })
export class ChildResolver {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Query(() => [NationalRegistryChild], {
    name: 'nationalRegistryChildren',
    nullable: true,
  })
  @Audit()
  getMyChildren(@CurrentUser() user: AuthUser): Promise<FamilyChild[]> {
    return this.nationalRegistryService.getChildren(user.nationalId)
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(
    @Parent() { homeAddress, postal }: FamilyChild,
  ): string {
    return `${homeAddress}, ${postal}`
  }
}
