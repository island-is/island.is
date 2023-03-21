import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { AllTypesResult } from '../models/allTypesResult.model'
import { AllTypesResultService } from './types.service'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class AllTypesResultResolver {
  constructor(private allTypesResultService: AllTypesResultService) {}
  @Query(() => AllTypesResult, { name: 'consultationPortalAllTypes' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getAllTypes(): Promise<AllTypesResult> {
    const allTypes = await this.allTypesResultService.getAllTypes()
    return allTypes
  }
}
