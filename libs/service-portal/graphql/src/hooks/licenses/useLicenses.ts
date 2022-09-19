import { ApolloError, useQuery } from '@apollo/client'
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
  error?: ApolloError | undefined
}

export const useLicenses = (types?: Array<GenericLicenseType>): Props => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'

  const input = types ? { includedTypes: types } : {}

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
    }
  }, [data, loading])

  return {
    data: licenses,
    loading,
    error,
  }
}

interface GetDrivingLicenseProps {
  data?: DrivingLicenseType
  status: GenericUserLicenseStatus | ''
  loading?: boolean
  error?: ApolloError | undefined
}

/* Collects only Driving License */
// TODO: Remove when the Generic License UI interface is ready
export const useDrivingLicense = (): GetDrivingLicenseProps => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading, error } = useQuery<Query>(GET_GENERIC_LICENSE, {
    variables: {
      locale,
      input: {
        licenseType: 'DriversLicense',
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
