import { useLocalizedQuery } from '@island.is/localization'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplications = () => {
  const { data, loading, error, refetch } = useLocalizedQuery(
    APPLICATION_APPLICATIONS,
  )

  return {
    data: data?.applicationApplications ?? [],
    loading,
    error,
    refetch,
  }
}
