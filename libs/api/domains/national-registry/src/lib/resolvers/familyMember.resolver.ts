import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FamilyMember, Child } from '../shared/models'
import { GetFamilyInfoInput } from '../v1/dto/getFamilyDetailInput'
import { SoffiaService } from '../v1/soffia.service'
import { FamilyChild } from '../v1/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => FamilyMember)
@Audit({ namespace: '@island.is/api/national-registry' })
export class FamilyMemberResolver {
  constructor(private readonly nationalRegistryService: SoffiaService) {}

  @Query(() => [FamilyMember], {
    name: 'nationalRegistryFamily',
    nullable: true,
    deprecationReason:
      'Up for removal. Query for custodians/parents/children/custodyinfo for the authenticated user instead of this.',
  })
  @Audit()
  getMyFamily(@CurrentUser() user: AuthUser): Promise<FamilyMember[]> {
    return this.nationalRegistryService.getFamily(user.nationalId)
  }

  @Query(() => Child, {
    name: 'nationalRegistryFamilyDetail',
    nullable: true,
  })
  @Audit()
  getMyFamilyDetail(
    @CurrentUser() user: AuthUser,
    @Args('input') input: GetFamilyInfoInput,
  ): Promise<FamilyChild> {
    return this.nationalRegistryService.getFamilyMemberDetails(
      user.nationalId,
      input.familyMemberNationalId,
    )
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(
    @Parent() { homeAddress, postal }: FamilyChild,
  ): string {
    return `${homeAddress}, ${postal}`
  }
}
