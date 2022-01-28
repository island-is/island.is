import { Locale } from '@island.is/shared/types'
import { useUserProfile } from './useUserProfile'
import { useUpdateUserProfile } from './useUpdateUserProfile'
import { useCreateUserProfile } from './useCreateUserProfile'

type UpdateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
  canNudge?: boolean
  bankInfo?: string
  emailStatus?: string
  mobileStatus?: string
}

export const useUpdateOrCreateUserProfile = () => {
  const { refetch } = useUserProfile()
  const {
    createUserProfile,
    loading: createLoading,
    error: createError,
  } = useCreateUserProfile()
  const {
    updateUserProfile,
    loading: updateLoading,
    error: updateError,
  } = useUpdateUserProfile()

  const updateOrCreateUserProfile = async (data: UpdateUserProfileData) => {
    const profile = await refetch()
    const userProfile = profile.data?.getUserProfile
    if (!userProfile)
      throw new Error(
        'User profile does not exist, one must be created before it can be updated',
      )

    const input = {
      email: data.email || userProfile.email || '',
      locale: data.locale || (userProfile.locale as Locale),
      mobilePhoneNumber:
        data.mobilePhoneNumber || userProfile.mobilePhoneNumber || '',
      canNudge:
        data.canNudge === undefined ? userProfile.canNudge : data.canNudge,
      bankInfo: data.bankInfo || userProfile.bankInfo || '',
      emailStatus: data?.emailStatus || userProfile?.emailStatus || undefined,
      mobileStatus:
        data?.mobileStatus || userProfile?.mobileStatus || undefined,
    }

    console.log('input', input)
    if (userProfile) {
      await updateUserProfile(input)
    } else {
      await createUserProfile(input)
    }
  }

  return {
    updateOrCreateUserProfile,
    loading: createLoading || updateLoading,
    error: createError || updateError,
  }
}
