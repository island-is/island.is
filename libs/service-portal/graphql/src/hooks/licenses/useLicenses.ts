import { useQuery } from '@apollo/client'
import { GenericUserLicenseStatus, Query } from '@island.is/api/schema'
import { Locale } from 'locale'
import { useEffect, useState } from 'react'
import { useUserProfile } from '../..'
import { GET_GENERIC_LICENSES } from '../../lib/queries/getDrivingLicense'
import {
  AdrLicenseType,
  DrivingLicenseType,
} from '@island.is/service-portal/core'

export interface LicenseData {
  data?: DrivingLicenseType | AdrLicenseType
  status?: GenericUserLicenseStatus
}

interface GetLicenseProps {
  data?: Array<LicenseData>
  loading?: boolean
  error?: any
}

/* Collects only Driving License */
// TODO: Generate hook for collecting all licenses when other services are ready
export const useLicenses = (): GetLicenseProps => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading, error } = useQuery<Query>(GET_GENERIC_LICENSES, {
    variables: {
      locale,
      input: { includedTypes: ['DriversLicense', 'AdrLicense'] },
    },
  })

  const [licenses, setLicenses] = useState<Array<LicenseData>>()
  const { genericLicenses } = data ?? {}

  useEffect(() => {
    if (!loading && !error) {
      const parsedLicenses: Array<LicenseData> = []

      console.log(genericLicenses)

      genericLicenses?.map((license) => {
        const licenseRaw =
          license?.payload && JSON.parse(license?.payload?.rawData)
        const licenseObject = licenseRaw && Object.assign(licenseRaw)

        licenseObject &&
          parsedLicenses.push({
            data: licenseObject,
            status: license.license.status,
          })
      })
      console.log('parsed licenses')
      console.log(parsedLicenses)
      parsedLicenses.length && setLicenses(parsedLicenses)
    }
  }, [data, loading])

  return {
    data: licenses,
    loading,
    error,
  }
}
