import * as Application from 'expo-application';
import compareVersions from 'compare-versions'
import { featureFlagClient } from '@/components/providers/feature-flag-provider'

export const needsToUpdateAppVersion = async (): Promise<boolean> => {
  const minimumVersionSupported = await featureFlagClient?.getValueAsync(
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
