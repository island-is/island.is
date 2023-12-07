import { FeatureFlagUser } from '@island.is/feature-flags'
import { Features } from '@island.is/nest/feature-flags'

export class MockFeatureFlagService {
  async getValue(
    feature: Features,
    defaultValue: boolean | string,
    user?: FeatureFlagUser,
  ) {
    if (feature === Features.exampleApplication) {
      return true
    }
    if (feature === Features.accidentNotification) {
      if (user?.id === '1234567890') {
        return true
      }
      return false
    }
    if (feature === Features.applicationSystemHistory) {
      if (user?.id === '1234564321') {
        return true
      }
      return false
    }
    return defaultValue
  }
}
