import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { AllTypesResult } from '../models/allTypesResult.model'
import { TypesService } from './types.service'
import { Audit } from '@island.is/nest/audit'

@Resolver()
@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.consultationPortalApplication)
@Audit({ namespace: '@island.is/samradsgatt' })
export class TypesResolver {
  constructor(private allTypesResultService: TypesService) {}
  @Query(() => AllTypesResult, { name: 'consultationPortalAllTypes' })
  async getAllTypes(): Promise<AllTypesResult> {
    const allTypes = await this.allTypesResultService.getAllTypes()
    return allTypes
  }
}
