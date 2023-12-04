import { client } from '../../graphql/client'
import {
  GetProfileDocument,
  GetProfileQuery,
  GetProfileQueryVariables,
  useUpdateProfileMutation,
} from '../../graphql/types/schema'

export const useUpdateUserProfile = () => {
  const [updateUserProfileMutation, { loading, error }] =
    useUpdateProfileMutation({
      client,
    })

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
    }).then((res) => {
      if (res.data) {
        try {
          client.query<GetProfileQuery, GetProfileQueryVariables>({
            query: GetProfileDocument,
            fetchPolicy: 'network-only',
          })
        } catch (err) {
          // do nothing
        }
      }
      return res
    })
  }

  return {
    updateUserProfile,
    loading,
    error,
  }
}
