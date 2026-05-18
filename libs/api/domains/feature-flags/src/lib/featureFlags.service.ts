import * as kennitala from 'kennitala'
import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type {
  FeatureFlagClient,
  FeatureFlagUser,
} from '@island.is/feature-flags'
import { FEATURE_FLAG_CLIENT } from '@island.is/nest/feature-flags'

import {
  FeatureFlagAttributesInput,
  FeatureFlagValues,
} from './featureFlags.model'

@Injectable()
export class FeatureFlagsService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  async getAllForUser(
    user: User,
    clientAttributes?: FeatureFlagAttributesInput,
  ): Promise<FeatureFlagValues> {
    const featureFlagUser = this.toFeatureFlagUser(user, clientAttributes)
    const flags = await this.client.getAllValues(featureFlagUser)
    return { flags }
  }

  private toFeatureFlagUser(
    user: User,
    clientAttributes?: FeatureFlagAttributesInput,
  ): FeatureFlagUser {
    const attributes: Record<string, string> = {}
    if (user.nationalId) {
      attributes.nationalId = user.nationalId
      attributes.subjectType = kennitala.isCompany(user.nationalId)
        ? 'legalEntity'
        : 'person'
    }
    if (clientAttributes?.appVersion) {
      attributes.appVersion = clientAttributes.appVersion
    }
    if (clientAttributes?.os) {
      attributes.os = clientAttributes.os
    }
    return { id: user.nationalId, attributes }
  }
}
