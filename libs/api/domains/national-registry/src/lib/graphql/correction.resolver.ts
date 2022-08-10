import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryService } from '../nationalRegistry.service'
import { FamilyCorrectionInput } from '../dto/FamilyCorrectionInput.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver()
@Audit({ namespace: '@island.is/api/national-registry' })
export class CorrectionResolver {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Audit()
  @Mutation(() => graphqlTypeJson, { nullable: true })
  async nationalRegistryChildCorrection(
    @Args('input') input: FamilyCorrectionInput,
  ) {
    return this.nationalRegistryService.postUserCorrection(input)
  }
}
