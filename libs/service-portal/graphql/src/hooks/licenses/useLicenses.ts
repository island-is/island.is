import { useQuery } from '@apollo/client'
import {
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicenseStatus,
  Query,
} from '@island.is/api/schema'
import { DrivingLicenseType } from '@island.is/service-portal/core'
import { Locale } from 'locale'
import { useEffect, useState } from 'react'
import { useUserProfile } from '../..'
import {
  GET_GENERIC_LICENSE,
  GET_GENERIC_LICENSES,
} from '../../lib/queries/getLicenses'
interface Props {
  data?: Array<GenericUserLicense>
  loading?: boolean
  error?: any
}

/* Collects only Driving License */
// TODO: Generate hook for collecting all licenses when other services are ready
export const useLicenses = (type?: GenericLicenseType): Props => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'

  const input = type ? { includedTypes: [type] } : {}

  const { data, loading, error } = useQuery<Query>(GET_GENERIC_LICENSES, {
    variables: {
      locale,
      input: input,
    },
  })

  const [licenses, setLicenses] = useState<Array<GenericUserLicense>>()
  const { genericLicenses } = data ?? {}

  useEffect(() => {
    if (!loading && !error) {
      genericLicenses?.length && setLicenses(genericLicenses)
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
interface GetLicenseProps {
  data?: DrivingLicenseType
  status: GenericUserLicenseStatus | ''
  loading?: boolean
  error?: any
}

/* Collects only Driving License */
// TODO: Generate hook for collecting all licenses when other services are ready
export const useDriversLicense = (
  licenseType: GenericLicenseType,
): GetLicenseProps => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading, error } = useQuery<Query>(GET_GENERIC_LICENSE, {
    variables: {
      locale,
      input: {
        //CHANGE THIS BACK!
        licenseType,
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
