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
import { FamilyChild } from '../types'

import { NationalRegistryChild } from './models'

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
}
