import { useLocalizedQuery } from '@island.is/localization'

import { FORM_SYSTEM_APPLICATIONS } from '@island.is/form-system/graphql'

export const useFormSystemApplications = () => {
  const { data, loading, error, refetch } = useLocalizedQuery(
    FORM_SYSTEM_APPLICATIONS,
    {
      variables: {
        input: { scopeCheck: true },
      },
    },
  )

  return {
    data: data?.formSystemMyPagesApplications ?? [],
    loading,
    error,
    refetch,
  }
}
