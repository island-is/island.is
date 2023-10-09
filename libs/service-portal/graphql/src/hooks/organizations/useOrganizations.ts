import { useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS_QUERY } from '../../lib/queries/getOrganizations'

export const useOrganizations = () => {
  const { data, loading, error } = useQuery(GET_ORGANIZATIONS_QUERY)

  return {
    data: data?.getOrganizations?.items || {},
    loading,
    error,
  }
}
