import { m } from '../../lib/messages'
import type { Application } from '@island.is/application/core'
import { ApplicationEligibility } from '../../types/schema'
import { useQuery, gql } from '@apollo/client'
import { DrivingLicenseFakeData, YES } from '../../lib/constants'
import { DrivingLicenseApplicationFor, B_FULL } from '../../shared/constants'
import { fakeEligibility } from './fakeEligibility'

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
}

export const useEligibility = (
  answers: Application['answers'],
): UseEligibilityResult => {
  const fakeData = answers.fakeData as DrivingLicenseFakeData | undefined
  const usingFakeData = fakeData?.useFakeData === YES

  const applicationFor =
    (answers.applicationFor as DrivingLicenseApplicationFor) || B_FULL

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
      eligibility: fakeEligibility(applicationFor),
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
  }
}
