import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { AllTypesResult } from '../models/allTypesResult.model'
import { TypesService } from './types.service'
import { Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

@Resolver()
@UseGuards(FeatureFlagGuard, ScopesGuard)
@Scopes(ApiScope.samradsgatt)
@FeatureFlag(Features.consultationPortalApplication)
export class TypesResolver {
  constructor(private allTypesResultService: TypesService) {}
  @Query(() => AllTypesResult, { name: 'consultationPortalAllTypes' })
  async getAllTypes(): Promise<AllTypesResult> {
    const allTypes = await this.allTypesResultService.getAllTypes()
    return allTypes
  }
}
