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

import { FamilyMember, FamilyChild } from '../types'
import { GetFamilyInfoInput } from '../dto/getFamilyDetailInput'
import { SoffiaService } from '../soffia.service'
import { Child, FamilyMember as FamilyMemberModel } from '../../shared/models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => FamilyMemberModel)
@Audit({ namespace: '@island.is/api/national-registry' })
export class FamilyMemberResolver {
  constructor(private readonly nationalRegistryService: SoffiaService) {}

  @Query(() => [FamilyMemberModel], {
    name: 'nationalRegistryFamily',
    nullable: true,
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
