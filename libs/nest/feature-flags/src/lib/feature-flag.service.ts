import * as kennitala from 'kennitala'
import { Inject } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagUser, Features } from '@island.is/feature-flags'
import type {
  FeatureFlagClient,
  SettingValue,
  SettingTypeOf,
} from '@island.is/feature-flags'

import { FEATURE_FLAG_CLIENT } from './feature-flag.client'

export class FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  async getValue<T extends SettingValue>(
    feature: Features,
    defaultValue: T,
    user?: User,
  ): Promise<SettingTypeOf<T>> {
    return this.client.getValue(
      feature,
      defaultValue,
      user && this.getFeatureFlagUser(user),
    )
  }

  private getFeatureFlagUser(user: User): FeatureFlagUser {
    const attributes: Record<string, string> = {}
    if (user.nationalId) {
      attributes.subjectType = kennitala.isCompany(user.nationalId)
        ? 'legalEntity'
        : 'person'
    }

    return { id: user.nationalId, attributes }
  }
}
