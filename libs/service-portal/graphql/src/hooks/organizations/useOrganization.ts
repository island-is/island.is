import { useQuery } from '@apollo/client'
import { GET_ORGANIZATION_QUERY } from '../../lib/queries/getOrganizations'
import { Query } from '@island.is/api/schema'

export const useOrganization = (slug?: string) => {
  const { data, loading, error } = useQuery<Query>(GET_ORGANIZATION_QUERY, {
    variables: { input: { slug } },
  })

  return {
    data: data?.getOrganization ?? undefined,
    loading,
    error,
  }
}
