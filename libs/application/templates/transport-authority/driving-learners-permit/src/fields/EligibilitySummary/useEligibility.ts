import { getValueViaPath, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ApplicationEligibility } from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import { LearnersPermitFakeData } from '../../lib/constants'
import { fakeEligibility } from './fakeEligibility'
import { ELIGIBILITY_QUERY } from '../../graphql'

export interface UseEligibilityResult {
  error?: Error
  eligibility?: ApplicationEligibility
  loading: boolean
}

export const useEligibility = (
  answers: Application['answers'],
): UseEligibilityResult => {
  const fakeData = getValueViaPath<LearnersPermitFakeData>(answers, 'fakeData')
  const usingFakeData = fakeData?.useFakeData === YES

  const {
    data = {},
    error,
    loading,
  } = useQuery(ELIGIBILITY_QUERY, {
    skip: usingFakeData,
  })

  if (usingFakeData) {
    return {
      loading: false,
      eligibility: fakeEligibility({
        categoryIssued: fakeData?.mentorLicenseIssuedDate ?? undefined,
        categoryType: fakeData?.currentLicense === 'B-full' ? 'B' : 'none',
        deprivationDateTo: fakeData?.deprivationDateTo ?? undefined,
        deprivationDateFrom: fakeData?.deprivationDateFrom ?? undefined,
        mentorAge: fakeData?.mentorAge ?? '20',
      }),
    }
  }

  if (error) {
    console.error(error)
    return {
      loading: false,
      error: error,
    }
  }

  return {
    loading,
    eligibility: data.learnerMentorEligibility,
  }
}
