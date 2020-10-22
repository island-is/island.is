import { useMutation } from '@apollo/client'
import { Mutation, MutationUpdateProfileArgs } from '@island.is/api/schema'
import { UPDATE_USER_PROFILE } from '../../lib/mutations/updateUserProfile'
import { Locale } from '@island.is/localization'
import { useUserProfile } from './useUserProfile'

export type UpdateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
}

export const useUpdateUserProfile = (natreg: string) => {
  const { data: userProfile } = useUserProfile(natreg)
  const [updateUserProfileMutation, { loading, error }] = useMutation<
    Mutation,
    MutationUpdateProfileArgs
  >(UPDATE_USER_PROFILE)

  const updateUserProfile = (data: UpdateUserProfileData) => {
    if (!userProfile)
      throw new Error(
        'User profile does not exist, one must be created before it can be updated',
      )

    return updateUserProfileMutation({
      variables: {
        input: {
          nationalId: natreg,
          email: data.email || userProfile.email,
          locale: data.locale || userProfile.locale,
          mobilePhoneNumber:
            data.mobilePhoneNumber || userProfile.mobilePhoneNumber,
        },
      },
    })
  }

  return {
    updateUserProfile,
    loading,
    error,
  }
}
