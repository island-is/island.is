import { useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS_QUERY } from '../../lib/queries/getOrganizations'
import { Query } from '@island.is/api/schema'
import { Organization } from '@island.is/shared/types'

export const useOrganizations = () => {
  const { data, loading, error } = useQuery<Query>(GET_ORGANIZATIONS_QUERY)

  return {
    data: (data?.getOrganizations?.items ?? []) as Organization[],
    loading,
    error,
  }
}
