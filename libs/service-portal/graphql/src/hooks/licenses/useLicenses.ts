import { useQuery } from '@apollo/client'
import {
  GenericLicenseType,
  GenericUserLicense,
  Query,
} from '@island.is/api/schema'
import { Locale } from 'locale'
import { useEffect, useState } from 'react'
import { GenericLicenseType, useUserProfile } from '../..'
import { GET_GENERIC_LICENSES } from '../../lib/queries/getLicenses'
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
