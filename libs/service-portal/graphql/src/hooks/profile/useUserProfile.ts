import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export const useUserProfile = () => {
  const { data, loading, error } = useQuery<Query>(USER_PROFILE)

  return {
    data: data?.getUserProfile || null,
    loading,
    error,
  }
}
