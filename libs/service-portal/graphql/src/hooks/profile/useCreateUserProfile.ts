import { useMutation } from '@apollo/client'
import { Mutation, MutationCreateProfileArgs } from '@island.is/api/schema'
import { Locale } from '@island.is/localization'
import { CREATE_USER_PROFILE } from '../../lib/mutations/createUserProfile'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type CreateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
}

export const useCreateUserProfile = () => {
  const [createUserProfileMutation, { loading, error }] = useMutation<
    Mutation,
    MutationCreateProfileArgs
  >(CREATE_USER_PROFILE, {
    refetchQueries: [
      {
        query: USER_PROFILE,
      },
    ],
  })

  const createUserProfile = (data: CreateUserProfileData) => {
    return createUserProfileMutation({
      variables: {
        input: {
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
