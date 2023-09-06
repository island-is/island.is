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

import { SoffiaService } from '../v1/soffia.service'
import { FamilyChild } from '../v1/types'
import { Child } from '../shared/models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => Child)
@Audit({ namespace: '@island.is/api/national-registry' })
export class ChildResolver {
  constructor(private readonly soffiaService: SoffiaService) {}

  @Query(() => [Child], {
    name: 'nationalRegistryChildren',
    nullable: true,
    deprecationReason:
      'Up for removal. Query children/childCustody for authenticated user instead',
  })
  @Audit()
  getMyChildren(@CurrentUser() user: AuthUser): Promise<FamilyChild[]> {
    return this.soffiaService.getChildren(user.nationalId)
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(
    @Parent() { homeAddress, postal }: FamilyChild,
  ): string {
    return `${homeAddress}, ${postal}`
  }
}
