import { useQuery } from '@apollo/client'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplications = () => {
  const { data, loading, error } = useQuery(APPLICATION_APPLICATIONS)

  return {
    data: data?.applicationApplications ?? [],
    loading,
    error,
  }
}
