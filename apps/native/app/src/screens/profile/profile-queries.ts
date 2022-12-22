import { useMutation, useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { UPDATE_USER_PROFILE } from '../../graphql/queries/update-user-profile.mutation'
import { USER_PROFILE_QUERY } from '../../graphql/queries/user-profile.query'

export const useUpdateUserProfile = () => {
  const [updateUserProfileMutation, { loading, error }] = useMutation(
    UPDATE_USER_PROFILE,
    {
      client,
      refetchQueries: [
        {
          query: USER_PROFILE_QUERY,
        },
      ],
    },
  )

  const updateUserProfile = (input: {
    email?: string
    mobilePhoneNumber?: string
    bankInfo?: string
    emailCode?: string
    smsCode?: string
  }) => {
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

export const useUserProfile = () =>
  useQuery(USER_PROFILE_QUERY, {
    client,
  })
