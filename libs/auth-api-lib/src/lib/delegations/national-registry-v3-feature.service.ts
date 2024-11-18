import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

@Injectable()
export class NationalRegistryV3FeatureService {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  getValue(user: User): Promise<boolean> {
    return this.featureFlagService.getValue(
      Features.isNationalRegistryV3DeceasedStatusEnabled,
      false,
      user,
    )
  }
}
