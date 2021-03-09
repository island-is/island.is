import { useLazyQuery, useQuery } from '@apollo/client'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplicationsCompleted = () => {
  const [
    applicationApplicationsCompleted,
    { data, loading, error },
  ] = useLazyQuery(APPLICATION_APPLICATIONS, {
    variables: { input: { completed: true } },
  })

  return {
    applicationApplicationsCompleted,
    data: data?.applicationApplications ?? [],
    loading,
    error,
  }
}
