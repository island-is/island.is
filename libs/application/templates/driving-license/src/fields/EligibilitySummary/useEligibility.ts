import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ApplicationEligibility } from '../../types/schema'
import { useQuery, gql } from '@apollo/client'
import { DrivingLicenseFakeData, YES } from '../../lib/constants'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_TEMP,
  B_RENEW,
} from '../../shared/constants'
import { fakeEligibility } from './fakeEligibility'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'

const QUERY = gql`
  query EligibilityQuery($input: ApplicationEligibilityInput!) {
    drivingLicenseApplicationEligibility(input: $input) {
      isEligible
      requirements {
        key
        requirementMet
      }
    }
  }
`
export interface UseEligibilityResult {
  error?: Error
  eligibility?: ApplicationEligibility
  loading: boolean
  applicationFor?: DrivingLicenseApplicationFor
}

export const useEligibility = ({
  answers,
  externalData,
}: Application): UseEligibilityResult => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(answers, 'fakeData')
  const usingFakeData = fakeData?.useFakeData === YES

  const { setValue } = useFormContext()
  const currentLicenseData = getValueViaPath<CurrentLicenseProviderResult>(
    externalData,
    'currentLicense.data',
  )
  const applicationFor = !currentLicenseData?.currentLicense
    ? B_TEMP
    : currentLicenseData?.currentLicense === 'B'
    ? B_FULL
    : B_RENEW
  useEffect(() => {
    setValue('applicationFor', applicationFor)
  }, [applicationFor, setValue])

  const { data = {}, error, loading } = useQuery(QUERY, {
    skip: usingFakeData,
    variables: {
      input: {
        applicationFor,
      },
    },
  })

  if (usingFakeData) {
    return {
      loading: false,
      eligibility: fakeEligibility(applicationFor, currentLicenseData?.expires),
      applicationFor,
    }
  }

  if (error) {
    console.error(error)
    // TODO: m.
    return {
      loading: false,
      error: error,
    }
  }

  return {
    loading,
    eligibility: data.drivingLicenseApplicationEligibility,
    applicationFor,
  }
}
