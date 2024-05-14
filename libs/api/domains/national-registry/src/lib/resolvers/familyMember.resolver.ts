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
import { FamilyChild } from '../v1/types'
import { NationalRegistryService } from '../nationalRegistry.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => FamilyMember)
@Audit({ namespace: '@island.is/api/national-registry' })
export class FamilyMemberResolver {
  constructor(private readonly service: NationalRegistryService) {}

  @Query(() => [FamilyMember], {
    name: 'nationalRegistryFamily',
    nullable: true,
    deprecationReason:
      'Up for removal. Query for custodians/parents/children/custodyinfo for the authenticated user instead of this.',
  })
  @Audit()
  async getMyFamily(
    @CurrentUser() user: AuthUser,
  ): Promise<FamilyMember[] | null> {
    const api = await this.service.getApi(user)
    return this.service.getFamily(user.nationalId, api)
  }

  @Query(() => Child, {
    name: 'nationalRegistryFamilyDetail',
    nullable: true,
  })
  @Audit()
  async getMyFamilyDetail(
    @CurrentUser() user: AuthUser,
    @Args('input') input: GetFamilyInfoInput,
  ): Promise<FamilyChild | null> {
    const api = await this.service.getApi(user)
    return this.service.getFamilyMemberDetails(
      user.nationalId,
      input.familyMemberNationalId,
      api,
    )
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(
    @Parent() { homeAddress, postal }: FamilyChild,
  ): string {
    return `${homeAddress}, ${postal}`
  }
}
