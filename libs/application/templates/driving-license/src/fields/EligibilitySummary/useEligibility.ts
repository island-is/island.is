import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { useQuery, gql } from '@apollo/client'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  BE,
  codesExtendedLicenseCategories,
  codesRequiringHealthCertificate,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  otherLicenseCategories,
  remarksCannotRenew65,
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
    getValueViaPath<boolean>(
      application.externalData,
      'qualityPhoto.data.hasQualityPhoto',
    ) ?? false

  const hasOtherCategoryOrHealthRemarks = (
    currentLicense: DrivingLicense | undefined,
  ) => {
    return (
      (currentLicense?.categories.some((license) =>
        otherLicenseCategories.includes(license.nr),
      ) ??
        false) ||
      currentLicense?.remarks?.some((remark) =>
        codesRequiringHealthCertificate.includes(remark.code),
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
    return {
      loading: false,
      error: error,
    }
  }

  const eligibility =
    data.drivingLicenseApplicationEligibility === undefined
      ? []
      : (data.drivingLicenseApplicationEligibility as ApplicationEligibility)
          .requirements

  //TODO: Remove when RLS/SGS supports health certificate in BE license
  if (application.answers.applicationFor === BE) {
    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            !hasGlasses &&
            hasQualityPhoto &&
            !hasOtherCategoryOrHealthRemarks(currentLicense),
        requirements: [
          ...eligibility,
          {
            key: RequirementKey.BeRequiresHealthCertificate,
            requirementMet:
              !hasGlasses && !hasOtherCategoryOrHealthRemarks(currentLicense),
          },
          {
            key: RequirementKey.HasNoPhoto,
            requirementMet: hasQualityPhoto,
          },
        ],
      },
    }
  }

  if (application.answers.applicationFor === B_FULL_RENEWAL_65) {
    const licenseB = currentLicense?.categories?.find(
      (license) => license.nr === 'B',
    )

    const drivingLicenseIssued = licenseB?.issued

    let hasExtendedDrivingLicense = false

    if (drivingLicenseIssued) {
      const relevantCategories = currentLicense?.categories?.filter((x) =>
        codesExtendedLicenseCategories.includes(x.nr),
      )

      if (relevantCategories?.length) {
        // if the user has any categories that indicate an extended driving license
        hasExtendedDrivingLicense = true

        // if any of the issued dates are exactly the same, they were most likely
        // created 1993 (or around that time) and are not considered extended
        // drivers licenses in that case
        hasExtendedDrivingLicense = !relevantCategories.some(
          (x) => x.issued === drivingLicenseIssued,
        )
      }
    }

    const hasAnyInvalidRemarks = currentLicense?.remarks?.some((remark) =>
      remarksCannotRenew65.includes(remark.code),
    )

    const requirements = [
      ...eligibility,
      {
        key: RequirementKey.HasNoPhoto,
        requirementMet: hasQualityPhoto,
      },
    ]

    if (hasExtendedDrivingLicense) {
      requirements.push({
        key: RequirementKey.NoExtendedDrivingLicense,
        requirementMet: false,
      })
    }

    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            hasQualityPhoto &&
            !hasExtendedDrivingLicense &&
            !hasAnyInvalidRemarks,
        requirements,
      },
    }
  }

  return {
    loading,
    eligibility: data.drivingLicenseApplicationEligibility,
  }
}
