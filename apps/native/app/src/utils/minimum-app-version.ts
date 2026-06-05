import * as Application from 'expo-application'
import compareVersions from 'compare-versions'
import { getFeatureFlagValue } from '@/lib/feature-flag-client'

export const needsToUpdateAppVersion = (): boolean => {
  const minimumVersionSupported = getFeatureFlagValue(
    'minimumSupportedAppVersion',
    '1.0.0',
  )

  if (!minimumVersionSupported) {
    return false
  }

  const currentVersion = Application.nativeApplicationVersion ?? ''

  // @example compare('2.0.0', '1.5.0', '>') => true (update needed)
  return compareVersions.compare(minimumVersionSupported, currentVersion, '>')
}
