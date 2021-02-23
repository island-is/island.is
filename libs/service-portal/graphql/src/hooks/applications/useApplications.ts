import { useQuery } from '@apollo/client'
import { GET_APPLICATIONS } from '../../lib/queries/getApplications'

export const useApplications = () => {
  const { data, loading, error } = useQuery(GET_APPLICATIONS)

  return {
    data: data?.getApplications || null,
    loading,
    error,
  }
}
