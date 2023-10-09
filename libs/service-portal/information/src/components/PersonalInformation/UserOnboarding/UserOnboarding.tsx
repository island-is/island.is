import { useAuth } from '@island.is/auth/react'
import { useGetUserProfileQuery } from './UserOnboarding.generated'
import { UserProfileScope } from '@island.is/auth/scopes'
import { showUserOnboardingModal } from '../../../utils/showUserOnboardingModal'
import { UserOnboardingModal } from '../UserOnboardingModal/UserOnboardingModal'
import { Suspense } from 'react'

const isDevelopment = process.env.NODE_ENV === 'development'

const UserOnboarding = () => {
  const { userInfo } = useAuth()
  const { data, loading } = useGetUserProfileQuery()

  if (data && !loading && userInfo) {
    const showTheModal = showUserOnboardingModal(data?.getUserProfile)

    if (
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
