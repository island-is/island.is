import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'

import { NationalRegistryFamilyMember } from './models'
import { NationalRegistryService } from '../nationalRegistry.service'
import { FamilyMember } from '../types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => NationalRegistryFamilyMember)
export class FamilyMemberResolver {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Query(() => [NationalRegistryFamilyMember], {
    name: 'nationalRegistryFamily',
    nullable: true,
  })
  getMyFamily(@CurrentUser() user: AuthUser): Promise<FamilyMember[]> {
    return this.nationalRegistryService.getFamily(user.nationalId)
  }
}
