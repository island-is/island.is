import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { useQuery, gql } from '@apollo/client'
import {
  B_FULL,
  BE,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  YES,
} from '../../lib/constants'
import { fakeEligibility } from './fakeEligibility'
import { DrivingLicense } from '../../lib/types'

const QUERY = gql`
  query EligibilityQuery($input: ApplicationEligibilityInput!) {
    drivingLicenseApplicationEligibility(input: $input) {
      isEligible
      requirements {
        key
        requirementMet
        daysOfResidency
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
  application: Application,
): UseEligibilityResult => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(
    application.answers,
    'fakeData',
  )
  const usingFakeData = fakeData?.useFakeData === YES

  const applicationFor =
    getValueViaPath<DrivingLicenseApplicationFor>(
      application.answers,
      'applicationFor',
      B_FULL,
    ) ?? B_FULL

  const {
    data = {},
    error,
    loading,
  } = useQuery(QUERY, {
    skip: usingFakeData,
    variables: {
      input: {
        applicationFor,
      },
    },
  })

  //TODO: Remove when RLS/SGS supports health certificate in BE license
  const hasGlasses = getValueViaPath<boolean>(
    application.externalData,
    'glassesCheck.data',
  )
  const currentLicense = getValueViaPath<DrivingLicense>(
    application.externalData,
    'currentLicense.data',
  )
  const hasQualityPhoto =
    getValueViaPath<boolean>(application.externalData, 'qualityPhoto.data') ??
    false
  const hasOtherLicenseCategories = (
    currentLicense: DrivingLicense | undefined,
  ) => {
    return (
      (currentLicense?.categories.some(
        (license) =>
          license.nr === 'C' ||
          license.nr === 'C1' ||
          license.nr === 'CE' ||
          license.nr === 'D' ||
          license.nr === 'D1' ||
          license.nr === 'DE',
      ) ??
        false) ||
      currentLicense?.remarks?.some((x) =>
        x.includes(
          'Réttindi til farþegaflutninga í atvinnuskyni fyrir B-flokk.',
        ),
      )
    )
  }

  if (usingFakeData) {
    return {
      loading: false,
      eligibility: fakeEligibility(
        applicationFor,
        parseInt(fakeData?.howManyDaysHaveYouLivedInIceland.toString(), 10),

        //TODO: Remove when RLS/SGS supports health certificate in BE license
        hasGlasses,
      ),
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

  //TODO: Remove when RLS/SGS supports health certificate in BE license
  if (application.answers.applicationFor === BE) {
    const eligibility =
      data.drivingLicenseApplicationEligibility === undefined
        ? []
        : (data.drivingLicenseApplicationEligibility as ApplicationEligibility)
            .requirements
    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            !hasGlasses &&
            hasQualityPhoto,
        requirements: [
          ...eligibility,
          {
            key: RequirementKey.BeRequiresHealthCertificate,
            requirementMet:
              !hasGlasses && !hasOtherLicenseCategories(currentLicense),
          },
          {
            key: RequirementKey.HasNoPhoto,
            requirementMet: hasQualityPhoto,
          },
        ],
      },
    }
  }

  return {
    loading,
    eligibility: data.drivingLicenseApplicationEligibility,
  }
}
