import { Suspense, useEffect, useState } from 'react'

import { useAuth } from '@island.is/auth/react'
import { UserProfileScope } from '@island.is/auth/scopes'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'

import { useGetUserProfileQuery } from './UserOnboarding.generated'
import { UserOnboardingModal } from '../UserOnboardingModal/UserOnboardingModal'
import { showUserOnboardingModal } from '../../../utils/showUserOnboardingModal'

const isDevelopment = process.env.NODE_ENV === 'development'

const UserOnboarding = () => {
  const { userInfo } = useAuth()
  const { data, loading } = useGetUserProfileQuery()

  const featureFlagCLI = useFeatureFlagClient()
  const [hiddenByFeatureFlag, setHiddenByFeatureFlag] = useState<boolean>(true)

  useEffect(() => {
    const isFlagEnabled = async () => {
      /**
       *  Hide the modal if feature flag is enabled.
       *  If the feature flag is enabled that means that the user will see the user profile collection in the IDS right after login
       */
      setHiddenByFeatureFlag(
        await featureFlagCLI.getValue(Features.isIASSpaPagesEnabled, false),
      )
    }
    isFlagEnabled()
  }, [])

  if (data && !loading && userInfo) {
    const showTheModal = showUserOnboardingModal(data?.getUserProfile)

    if (
      !hiddenByFeatureFlag &&
      !isDevelopment &&
      userInfo.scopes.includes(UserProfileScope.write) &&
      showTheModal
    ) {
      return (
        <Suspense fallback={null}>
          <UserOnboardingModal />
        </Suspense>
      )
    }
  }

  return null
}

export default UserOnboarding
