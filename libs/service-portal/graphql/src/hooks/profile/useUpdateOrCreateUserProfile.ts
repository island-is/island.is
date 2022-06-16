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
  const {
    updateUserProfile,
    loading: updateLoading,
    error: updateError,
  } = useUpdateUserProfile()

  const updateOrCreateUserProfile = async (data: UpdateUserProfileData) => {
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

    // Update user profile handles update OR create.
    await updateUserProfile(input)
  }

  return {
    updateOrCreateUserProfile,
    loading: updateLoading,
    error: updateError,
  }
}
