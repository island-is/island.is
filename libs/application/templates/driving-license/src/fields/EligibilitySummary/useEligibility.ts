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
  BE,
  codesExtendedLicenseCategories,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  QUALITY_IMAGE_TYPE_IDS,
  remarksCannotRenew65,
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
  is65RenewalRedesignEnabled: boolean,
  isBTempRedesignEnabled = false,
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

  const usesNewPhotoSelector =
    applicationFor === BE ||
    (applicationFor === B_FULL_RENEWAL_65 && is65RenewalRedesignEnabled) ||
    (applicationFor === B_TEMP && isBTempRedesignEnabled)

  if (usingFakeData) {
    let hasPhoto: boolean
    if (usesNewPhotoSelector) {
      // When a photo source is set to 'real', the data provider falls through
      // to RLS, so externalData reflects whatever the logged-in user actually
      // has. For 'yes' it's faked into externalData; for 'no' it's empty.
      // In all three cases, reading externalData via the same logic the real
      // path uses gives us the correct hasPhoto.
      const thjodskraOrRLSIsReal =
        fakeData?.hasThjodskraPhoto === 'real' ||
        fakeData?.hasRLSPhoto === 'real'

      if (thjodskraOrRLSIsReal) {
        const qualityPhotoAndSignature = getValueViaPath<{
          imageTypeId?: number | null
          pohto?: string | null
        }>(application.externalData, 'qualityPhotoAndSignature.data')
        const qualityPhotoConfirmed =
          QUALITY_IMAGE_TYPE_IDS.includes(
            qualityPhotoAndSignature?.imageTypeId ?? 0,
          ) && !!qualityPhotoAndSignature?.pohto

        const thjodskraPhotos =
          getValueViaPath<{
            images?: Array<{ contentSpecification?: string }>
          }>(application.externalData, 'allPhotosFromThjodskra.data')?.images ??
          []
        const hasThjodskraFacial = thjodskraPhotos.some(
          (p) => p.contentSpecification === 'FACIAL',
        )

        hasPhoto = qualityPhotoConfirmed || hasThjodskraFacial
      } else {
        hasPhoto =
          fakeData?.hasThjodskraPhoto === YES || fakeData?.hasRLSPhoto === YES
      }
    } else {
      hasPhoto = fakeData?.qualityPhoto === YES
    }
    return {
      loading: false,
      eligibility: fakeEligibility(
        applicationFor,
        parseInt(fakeData?.howManyDaysHaveYouLivedInIceland.toString(), 10),
        hasPhoto,
        is65RenewalRedesignEnabled,
        isBTempRedesignEnabled,
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

  // BE and redesigned 65+ both use the new photo selector (Thjóðskrá +
  // RLS quality photo) and gate eligibility on having a usable photo.
  const computeUsablePhoto = () => {
    const qualityPhotoAndSignature = getValueViaPath<{
      imageTypeId?: number | null
      pohto?: string | null
    }>(application.externalData, 'qualityPhotoAndSignature.data')

    const qualityPhotoConfirmed =
      QUALITY_IMAGE_TYPE_IDS.includes(
        qualityPhotoAndSignature?.imageTypeId ?? 0,
      ) && !!qualityPhotoAndSignature?.pohto

    const thjodskraPhotos =
      getValueViaPath<{ images?: Array<{ contentSpecification?: string }> }>(
        application.externalData,
        'allPhotosFromThjodskra.data',
      )?.images ?? []

    const hasThjodskraFacial = thjodskraPhotos.some(
      (p) => p.contentSpecification === 'FACIAL',
    )

    return qualityPhotoConfirmed || hasThjodskraFacial
  }

  if (application.answers.applicationFor === BE) {
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

    // When the redesign is on, also require a usable photo (same as BE).
    const hasUsablePhoto = is65RenewalRedesignEnabled
      ? computeUsablePhoto()
      : true

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
      ...(is65RenewalRedesignEnabled
        ? [
            {
              key: RequirementKey.hasNoPhoto,
              requirementMet: hasUsablePhoto,
            },
          ]
        : []),
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

  if (application.answers.applicationFor === B_TEMP && isBTempRedesignEnabled) {
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
