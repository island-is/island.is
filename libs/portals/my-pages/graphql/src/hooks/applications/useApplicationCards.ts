import { useLocalizedQuery } from '@island.is/localization'
import { APPLICATION_CARDS } from '../../lib/queries/getApplicationCards'

export const useApplicationCards = () => {
  const { data, loading, error, refetch } = useLocalizedQuery(
    APPLICATION_CARDS,
    {
      variables: {
        input: { scopeCheck: true },
      },
    },
  )

  return {
    data: data?.ApplicationCard ?? [],
    loading,
    error,
    refetch,
  }
}
