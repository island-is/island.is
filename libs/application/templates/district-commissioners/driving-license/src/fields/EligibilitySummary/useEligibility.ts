import { getValueViaPath, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  ApplicationEligibility,
  ApplicationEligibilityRequirement,
  RequirementKey,
} from '@island.is/api/schema'
import { useQuery, gql } from '@apollo/client'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  codesExtendedLicenseCategories,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  remarksCannotRenew65,
} from '../../utils/constants'
import { fakeEligibility } from './fakeEligibility'
import { DrivingLicense } from '../../types'
import { hasUsableRlsQualityPhoto } from '../../utils'

const QUERY = gql`
  query EligibilityQuery($input: ApplicationEligibilityInput!) {
    drivingLicenseApplicationEligibility(input: $input) {
      isEligible
      requirements {
        key
        requirementMet
        daysOfResidency
        messageIs
        messageEn
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

  const currentLicense = getValueViaPath<DrivingLicense>(
    application.externalData,
    'currentLicense.data',
  )

  const hasExtendedDrivingLicense = (
    currentLicense: DrivingLicense | undefined,
    drivingLicenseIssued: string | undefined,
  ): boolean => {
    if (!drivingLicenseIssued) return false

    const relevantCategories = currentLicense?.categories?.filter((x) =>
      codesExtendedLicenseCategories.includes(x.nr),
    )

    if (!relevantCategories?.length) return false

    return relevantCategories.some((x) => x.issued !== drivingLicenseIssued)
  }

  if (usingFakeData) {
    // A usable photo can come from the RLS quality photo or a Þjóðskrá facial
    // photo. 'real' falls through to RLS/Þjóðskrá and populates externalData with
    // real data; 'yes' / 'no' / 'metadata-only' inject their fake shape into
    // externalData via the data provider. So in every case the right answer comes
    // from reading externalData through the same predicates the real path uses.
    const qualityPhotoConfirmed = hasUsableRlsQualityPhoto(
      application.externalData,
    )

    const thjodskraPhotos =
      getValueViaPath<{
        images?: Array<{ contentSpecification?: string }>
      }>(application.externalData, 'allPhotosFromThjodskra.data')?.images ?? []
    const hasThjodskraFacial = thjodskraPhotos.some(
      (p) => p.contentSpecification === 'FACIAL',
    )

    const hasPhoto = qualityPhotoConfirmed || hasThjodskraFacial

    return {
      loading: false,
      eligibility: fakeEligibility(
        applicationFor,
        parseInt(fakeData?.howManyDaysHaveYouLivedInIceland.toString(), 10),
        hasPhoto,
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

  const eligibility: ApplicationEligibilityRequirement[] =
    data.drivingLicenseApplicationEligibility?.requirements ?? []

  const computeUsablePhoto = () => {
    if (hasUsableRlsQualityPhoto(application.externalData)) return true

    const thjodskraPhotos =
      getValueViaPath<{ images?: Array<{ contentSpecification?: string }> }>(
        application.externalData,
        'allPhotosFromThjodskra.data',
      )?.images ?? []

    return thjodskraPhotos.some((p) => p.contentSpecification === 'FACIAL')
  }

  if (application.answers.applicationFor === B_FULL_RENEWAL_65) {
    const licenseB = currentLicense?.categories?.find(
      (license) => license.nr === 'B',
    )
    const drivingLicenseIssued = licenseB?.issued

    const hasExtendedLicense = hasExtendedDrivingLicense(
      currentLicense,
      drivingLicenseIssued,
    )

    const hasAnyInvalidRemarks =
      currentLicense?.remarks?.some((remark) =>
        remarksCannotRenew65.includes(remark.code),
      ) ?? false

    // A usable photo is required.
    const hasUsablePhoto = computeUsablePhoto()

    const requirements = [
      ...eligibility,
      ...(hasExtendedLicense
        ? [
            {
              key: RequirementKey.noExtendedDrivingLicense,
              requirementMet: false,
            },
          ]
        : []),
      {
        key: RequirementKey.hasNoPhoto,
        requirementMet: hasUsablePhoto,
      },
    ]

    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            !hasExtendedLicense &&
            !hasAnyInvalidRemarks &&
            hasUsablePhoto,
        requirements,
      },
    }
  }

  if (application.answers.applicationFor === B_TEMP) {
    const hasUsablePhoto = computeUsablePhoto()

    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            hasUsablePhoto,
        requirements: [
          ...eligibility,
          {
            key: RequirementKey.hasNoPhoto,
            requirementMet: hasUsablePhoto,
          },
        ],
      },
    }
  }

  if (application.answers.applicationFor === B_FULL) {
    const hasUsablePhoto = computeUsablePhoto()

    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            hasUsablePhoto,
        requirements: [
          ...eligibility,
          {
            key: RequirementKey.hasNoPhoto,
            requirementMet: hasUsablePhoto,
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
