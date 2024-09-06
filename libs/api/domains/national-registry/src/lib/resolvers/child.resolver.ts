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

import { NationalRegistryService } from '../nationalRegistry.service'
import { FamilyChild } from '../v3/types'
import { Child } from '../shared/models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => Child)
@Audit({ namespace: '@island.is/api/national-registry' })
export class ChildResolver {
  constructor(private readonly service: NationalRegistryService) {}

  @Query(() => [Child], {
    name: 'nationalRegistryChildren',
    nullable: true,
    deprecationReason:
      'Up for removal. Query children/childCustody for authenticated user instead',
  })
  @Audit()
  async getMyChildren(
    @CurrentUser() user: AuthUser,
  ): Promise<FamilyChild[] | null> {
    return this.service.getChildren(user.nationalId)
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(
    @Parent() { homeAddress, postal }: FamilyChild,
  ): string | null {
    if (!homeAddress || !postal) {
      return null
    }
    return `${homeAddress}, ${postal}`
  }
}
