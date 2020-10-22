import { useMutation } from '@apollo/client'
import { Mutation, MutationCreateProfileArgs } from '@island.is/api/schema'
import { UPDATE_USER_PROFILE } from '../../lib/mutations/updateUserProfile'
import { Locale } from '@island.is/localization'

export type CreateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
}

export const useCreateUserProfile = (natreg: string) => {
  const [createUserProfileMutation, { loading, error }] = useMutation<
    Mutation,
    MutationCreateProfileArgs
  >(UPDATE_USER_PROFILE)

  const createUserProfile = (data: CreateUserProfileData) => {
    return createUserProfileMutation({
      variables: {
        input: {
          nationalId: natreg,
          email: data.email || '',
          locale: data.locale || '',
          mobilePhoneNumber: data.mobilePhoneNumber || '',
        },
      },
    })
  }

  return {
    createUserProfile,
    loading,
    error,
  }
}
