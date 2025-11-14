import { useLocalizedQuery } from '@island.is/localization'
import { COMBINED_APPLICATIONS } from '../../lib/queries/getCombinedApplications'

export const useCombinedApplications = () => {
  const { data, loading, error, refetch } = useLocalizedQuery(
    COMBINED_APPLICATIONS,
    {
      variables: {
        input: { scopeCheck: true },
      },
    },
  )

  return {
    data: data?.myPagesApplications ?? [],
    loading,
    error,
    refetch,
  }
}
