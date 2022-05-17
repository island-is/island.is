import { useQuery } from '@apollo/client'
import { GenericUserLicense, Query } from '@island.is/api/schema'
import { Locale } from 'locale'
import { useEffect, useState } from 'react'
import { useUserProfile } from '../..'
import { GET_GENERIC_LICENSES } from '../../lib/queries/getLicenses'
interface Props {
  data?: Array<GenericUserLicense>
  loading?: boolean
  error?: any
}

/* Collects only Driving License */
// TODO: Generate hook for collecting all licenses when other services are ready
export const useLicenses = (): Props => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading, error } = useQuery<Query>(GET_GENERIC_LICENSES, {
    variables: {
      locale,
      input: {},
    },
  })

  const [licenses, setLicenses] = useState<Array<GenericUserLicense>>()
  const { genericLicenses } = data ?? {}

  useEffect(() => {
    if (!loading && !error) {
      genericLicenses?.length && setLicenses(genericLicenses)
    }
  }, [data, loading])

  return {
    data: licenses,
    loading,
    error,
  }
}
