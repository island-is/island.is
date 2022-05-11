import { useQuery } from '@apollo/client'
import { GenericUserLicenseStatus, Query } from '@island.is/api/schema'
import { Locale } from 'locale'
import { useEffect, useState } from 'react'
import { useUserProfile } from '../..'
import { GET_GENERIC_LICENSE } from '../../lib/queries/getDrivingLicense'
import { DrivingLicenseType } from '@island.is/service-portal/core'

interface GetDrivingLicenseProps {
  data?: DrivingLicenseType
  status: GenericUserLicenseStatus | ''
  loading?: boolean
  error?: any
}

/* Collects only Driving License */
// TODO: Generate hook for collecting all licenses when other services are ready
export const useDrivingLicense = (): GetDrivingLicenseProps => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading, error } = useQuery<Query>(GET_GENERIC_LICENSE, {
    variables: {
      locale,
      input: {
        //CHANGE THIS BACK!
        licenseType: 'AdrLicense',
      },
    },
  })
  const [license, setLicense] = useState<DrivingLicenseType>()
  const { genericLicense } = data ?? {}
  const licenseStatus = genericLicense?.license.status ?? ''
  useEffect(() => {
    if (!loading && !error) {
      const licenseRaw =
        genericLicense?.payload && JSON.parse(genericLicense?.payload?.rawData)
      const licenseObject = licenseRaw && Object.assign(licenseRaw)
      licenseObject && setLicense(licenseObject)
    }
  }, [data, loading])

  return {
    data: license,
    loading,
    status: licenseStatus,
    error,
  }
}
