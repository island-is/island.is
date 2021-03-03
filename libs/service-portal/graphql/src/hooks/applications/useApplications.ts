import { useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'

import { GET_APPLICATIONS } from '../../lib/queries/getApplications'

type Locale = 'is' | 'en' | undefined

// TODO create a hook to handle locale better with cache and so on on nestjs side
export const useApplications = (locale: Locale) => {
  const { data, loading, error, refetch } = useQuery(GET_APPLICATIONS, {
    context: {
      headers: {
        locale,
      },
    },
  })

  useEffect(() => {
    refetch()
  }, [locale])

  return {
    data: data?.getApplications || null,
    loading,
    error,
  }
}
