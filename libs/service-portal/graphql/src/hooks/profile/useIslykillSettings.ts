import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { GET_ISLYKILL_SETTINGS } from '../../lib/queries/getIslykillSettings'

export const useIslykillSettings = () => {
  const { data, loading, error } = useQuery<Query>(GET_ISLYKILL_SETTINGS, {
    fetchPolicy: 'no-cache',
  })

  return {
    data: data?.getIslykillSettings || null,
    loading,
    error,
  }
}
