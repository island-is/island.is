import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryService } from '../nationalRegistry.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails) // TODO: Change scope
@Resolver()
@Audit({ namespace: '@island.is/api/national-registry' })
export class CorrectionResolver {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Audit()
  @Query(() => graphqlTypeJson, { nullable: true })
  async nationalRegistryChildCorrection() {
    return this.nationalRegistryService.postUserCorrection()
  }
}
