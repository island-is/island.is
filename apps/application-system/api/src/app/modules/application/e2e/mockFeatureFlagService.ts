import { User } from '@island.is/auth-nest-tools'
import { Features } from '@island.is/nest/feature-flags'

export class MockFeatureFlagService {
  async getValue(
    feature: Features,
    defaultValue: boolean | string,
    user?: User,
  ) {
    if (feature === Features.exampleApplication) {
      return true
    }
    if (feature === Features.accidentNotification) {
      if (user?.nationalId === '1234567890') {
        return true
      }
      return false
    }
    if (feature === Features.applicationSystemHistory) {
      if (user?.nationalId === '1234564321') {
        return true
      }
      return false
    }
    return defaultValue
  }
}
