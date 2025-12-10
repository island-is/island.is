import { Suspense, useEffect, useRef, useState } from 'react'

import { UserProfileScope } from '@island.is/auth/scopes'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'

import { useUserInfo } from '@island.is/react-spa/bff'
import { showUserOnboardingModal } from '../../../utils/showUserOnboardingModal'
import { UserOnboardingModal } from '../UserOnboardingModal/UserOnboardingModal'
import {
  GetUserProfileQuery,
  useGetUserProfileQuery,
} from './UserOnboarding.generated'

const UserOnboarding = () => {
  const userInfo = useUserInfo()
  // Use userRef to store the userProfile data to preserve the initial value after re-fetch.
  const userProfile = useRef<GetUserProfileQuery['getUserProfile'] | null>(null)
  const isCompany = userInfo?.profile?.subjectType === 'legalEntity'

  const { data, loading } = useGetUserProfileQuery({
    skip: !(isCompany && userInfo?.scopes.includes(UserProfileScope.write)),
    onCompleted: (data) => {
      if (!userProfile.current) {
        userProfile.current = data?.getUserProfile
      }
    },
  })

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

  if (data && !loading && userInfo && userProfile.current) {
    const showTheModal = showUserOnboardingModal(userProfile.current)

    if (
      (!hiddenByFeatureFlag || isCompany) &&
      //!isDevelopment &&
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
