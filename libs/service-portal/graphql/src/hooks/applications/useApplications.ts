import { useQuery } from '@apollo/client'
import { GET_APPLICATIONS } from '../../lib/queries/getApplications'

export const useApplications = (locale: 'is' | 'en' | undefined) => {
  const { data, loading, error } = useQuery(GET_APPLICATIONS, {
    variables: {
      input: { locale },
    }
  })

  return {
    data: data?.getApplications || null,
    loading,
    error,
  }
}
