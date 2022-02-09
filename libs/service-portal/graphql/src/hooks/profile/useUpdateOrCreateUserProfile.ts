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
  emailCode?: string
  smsCode?: string
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

    const input = {
      email: data.email,
      locale: data.locale,
      mobilePhoneNumber: data.mobilePhoneNumber,
      canNudge: data.canNudge,
      bankInfo: data.bankInfo,
      emailStatus: data?.emailStatus,
      mobileStatus: data?.mobileStatus,
      emailCode: data?.emailCode || undefined,
      smsCode: data?.smsCode || undefined,
    }

    if (userProfile?.modified) {
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
