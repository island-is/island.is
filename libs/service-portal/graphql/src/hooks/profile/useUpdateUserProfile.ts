import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationUpdateProfileArgs,
  UpdateUserProfileInput,
} from '@island.is/api/schema'
import { UPDATE_USER_PROFILE } from '../../lib/mutations/updateUserProfile'
import { Locale } from '@island.is/shared/types'
import { useUserProfile } from './useUserProfile'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type UpdateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
  canNudge?: boolean
  bankInfo?: string
}

export const useUpdateUserProfile = () => {
  const { data: userProfile } = useUserProfile()
  const [updateUserProfileMutation, { loading, error }] = useMutation<
    Mutation,
    MutationUpdateProfileArgs
  >(UPDATE_USER_PROFILE, {
    refetchQueries: [
      {
        query: USER_PROFILE,
      },
    ],
  })

  const updateUserProfile = (data: UpdateUserProfileData) => {
    if (!userProfile)
      throw new Error(
        'User profile does not exist, one must be created before it can be updated',
      )

    // API only accepts the values as optional and not as null fields
    // so we have to build the object dynamically
    const input: UpdateUserProfileInput = {}
    if (data.email ?? userProfile.email)
      input.email = data.email ?? userProfile.email
    if (data.locale ?? userProfile.locale)
      input.locale = data.locale ?? userProfile.locale
    if (data.mobilePhoneNumber ?? userProfile.mobilePhoneNumber)
      input.mobilePhoneNumber =
        data.mobilePhoneNumber ?? userProfile.mobilePhoneNumber
    if (data.canNudge !== undefined ?? userProfile.canNudge !== undefined)
      input.canNudge = data.canNudge ?? userProfile.canNudge
    if (data.bankInfo ?? userProfile.bankInfo)
      input.bankInfo = data.bankInfo ?? userProfile.bankInfo

    return updateUserProfileMutation({
      variables: {
        input,
      },
    })
  }

  return {
    updateUserProfile,
    loading,
    error,
  }
}
