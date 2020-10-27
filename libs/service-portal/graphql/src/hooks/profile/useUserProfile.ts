import { useQuery } from '@apollo/client'
import { Query, QueryGetUserProfileArgs } from '@island.is/api/schema'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export const useUserProfile = (natReg: string) => {
  const { data, loading, error } = useQuery<Query, QueryGetUserProfileArgs>(
    USER_PROFILE,
    {
      variables: {
        input: {
          nationalId: natReg,
        },
      },
    },
  )

  return {
    data: data?.getUserProfile || null,
    loading,
    error,
  }
}
