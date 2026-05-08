import * as kennitala from 'kennitala'
import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type { FeatureFlagClient, FeatureFlagUser } from '@island.is/feature-flags'
import { FEATURE_FLAG_CLIENT } from '@island.is/nest/feature-flags'

import { FeatureFlagValues } from './featureFlags.model'

@Injectable()
export class FeatureFlagsService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  async getAllForUser(user: User): Promise<FeatureFlagValues> {
    const featureFlagUser = this.toFeatureFlagUser(user)
    const flags = await this.client.getAllValues(featureFlagUser)
    return { flags }
  }

  private toFeatureFlagUser(user: User): FeatureFlagUser {
    const attributes: Record<string, string> = {}
    if (user.nationalId) {
      attributes.nationalId = user.nationalId
      attributes.subjectType = kennitala.isCompany(user.nationalId)
        ? 'legalEntity'
        : 'person'
    }
    return { id: user.nationalId, attributes }
  }
}
