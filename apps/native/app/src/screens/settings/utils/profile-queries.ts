import {
  useGetProfileLazyQuery,
  useUpdateProfileMutation,
} from '../../../graphql/types/schema'

export const useUpdateUserProfile = () => {
  const [updateUserProfileMutation, { loading, error }] =
    useUpdateProfileMutation()

  const [getProfileLazyQuery] = useGetProfileLazyQuery()

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
        getProfileLazyQuery({
          fetchPolicy: 'network-only',
        })
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
