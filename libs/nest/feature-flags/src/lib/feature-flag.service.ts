import { Inject } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type { FeatureFlagClient, Features } from '@island.is/feature-flags'

import { FEATURE_FLAG_CLIENT } from './feature-flag.client'

export class FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  async getValue(
    feature: Features,
    defaultValue: boolean | string,
    user?: User,
  ) {
    const featureFlagUser = user && { id: user.nationalId }
    return this.client.getValue(feature, defaultValue, featureFlagUser)
  }
}
