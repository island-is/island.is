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
interface UseEligibilityProps {
  fakeData?: DrivingLicenseFakeData
  applicationFor: DrivingLicenseApplicationFor
  currentLicense?: CurrentLicenseProviderResult
}
export const useEligibility = ({
  fakeData,
  applicationFor,
  currentLicense,
}: UseEligibilityProps): UseEligibilityResult => {
  const usingFakeData = fakeData?.useFakeData === YES

  const { setValue } = useFormContext()

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
      eligibility: fakeEligibility(applicationFor, currentLicense?.expires),
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
