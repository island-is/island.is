import { useQuery } from '@apollo/client'
import { GET_ORGANIZATION_QUERY } from '../../lib/queries/getOrganizations'
import { GET_ORGANIZATIONS_QUERY } from '../../lib/queries/getOrganizations'
import { Query } from '@island.is/api/schema'
import { Organization } from '@island.is/shared/types'

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

export const useOrganizations = () => {
  const { data, loading, error } = useQuery<Query>(GET_ORGANIZATIONS_QUERY)

  return {
    data: (data?.getOrganizations?.items ?? []) as Organization[],
    loading,
    error,
  }
}
