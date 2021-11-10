import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { GET_ISLYKILL_SETTINGS } from '../../lib/queries/getIslykillSettings'

interface Settings {
  skip: boolean
}

export const useIslykillSettings = (settings?: Settings) => {
  const { data, loading, error } = useQuery<Query>(GET_ISLYKILL_SETTINGS, {
    fetchPolicy: 'no-cache',
    skip: settings?.skip || false,
  })

  return {
    data: data?.getIslykillSettings || null,
    loading,
    error,
  }
}
