import { useLocalizedQuery } from '@island.is/localization'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplications = () => {
  const { data, loading, error, refetch } = useLocalizedQuery(
    APPLICATION_APPLICATIONS,
    {
      variables: {
        input: { scopeCheck: true },
      },
    },
  )

  return {
    data: data?.applicationApplications ?? [],
    loading,
    error,
    refetch,
  }
}
