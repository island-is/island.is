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

export type UserWithAttributes = User & { attributes?: Record<string, string> }

export class FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  async getValue<T extends SettingValue>(
    feature: Features,
    defaultValue: T,
    user?: FeatureFlagUser,
  ): Promise<SettingTypeOf<T>> {
    return this.client.getValue(
      feature,
      defaultValue,
      user && this.getFeatureFlagUser(user),
    )
  }

  private getFeatureFlagUser(user: FeatureFlagUser): FeatureFlagUser {
    return {
      id: user.id,
      attributes: {
        ...user?.attributes,
        ...(user.id
          ? {
              subjectType: kennitala.isCompany(user.id)
                ? 'legalEntity'
                : 'person',
            }
          : {}),
      },
    }
  }
}
