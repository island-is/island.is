import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplications = (locale?: Locale) => {
  const { data, loading, error, refetch } = useQuery(APPLICATION_APPLICATIONS, {
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
    data: data?.applicationApplications ?? [],
    loading,
    error,
  }
}
