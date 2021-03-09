import { useQuery } from '@apollo/client'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplicationsInProgress = () => {
  const { data, loading, error } = useQuery(APPLICATION_APPLICATIONS, {
    variables: { input: { completed: false } },
  })

  return {
    data: data?.applicationApplications ?? [],
    loading,
    error,
  }
}
