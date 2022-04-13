import { useQuery } from '@apollo/client'
import {
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicenseStatus,
  Query,
} from '@island.is/api/schema'
import { Locale } from 'locale'
import { useEffect, useState } from 'react'
import { useUserProfile } from '../..'
import { GET_ALL_GENERIC_LICENSES } from '../../lib/queries/getDrivingLicense'

interface GetDrivingLicenseProps {
  data?: Array<GenericUserLicense> | []
  loading?: boolean
  error?: any
}

/* Collects all Licenses */
export const useAllLicenses = (): GetDrivingLicenseProps => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading, error } = useQuery<Query>(GET_ALL_GENERIC_LICENSES, {
    variables: {
      locale,
      input: {
        includedTypes: ['DriversLicense', 'PassportLicense'],
      },
    },
  })
  const [license, setLicense] = useState<Array<GenericUserLicense>>()
  const { genericLicenses } = data ?? {}

  // useEffect(() => {
  //   if (!loading && !error) {
  //     const licenseRaw =
  //       genericLicense?.payload && JSON.parse(genericLicenses?.payload?.rawData)
  //     const licenseObject = licenseRaw && Object.assign(licenseRaw)
  //     licenseObject && setLicense(licenseObject)
  //   }
  // }, [data, loading])

  return {
    data: genericLicenses,
    loading,
    error,
  }
}
