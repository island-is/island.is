import { useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'

import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

export const useApplications = (locale?: Locale) => {
  const currentLocale = useRef(locale)
  const { data, loading, error, refetch } = useQuery(APPLICATION_APPLICATIONS, {
    variables: {
      locale,
    },
  })

  useEffect(() => {
    if (locale !== currentLocale.current) {
      currentLocale.current = locale
      refetch()
    }
  }, [locale])

  return {
    data: data?.applicationApplications ?? [],
    loading,
    error,
  }
}
