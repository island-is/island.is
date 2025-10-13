import { MessageDescriptor } from 'react-intl'
import { requirementsMessages } from '../../lib/messages'
import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import { ReviewSectionState, Step } from './ReviewSection'

export const extractReasons = (eligibility: ApplicationEligibility): Step[] => {
  return eligibility.requirements.map(
    ({ key, requirementMet, daysOfResidency }) => ({
      ...requirementKeyToStep(key, requirementMet),
      state: requirementMet
        ? ReviewSectionState.complete
        : ReviewSectionState.requiresAction,
      daysOfResidency: daysOfResidency ?? undefined,
    }),
  )
}

const getDeniedByServiceMessageDescription = (
  key: RequirementKey,
): MessageDescriptor => {
  switch (key) {
    case RequirementKey.noLicenseFound:
    case RequirementKey.noTempLicense:
      return requirementsMessages.invalidLicense
    case RequirementKey.hasDeprivation:
    case RequirementKey.hasPoints:
      return requirementsMessages.hasPointsOrDeprivation
    case RequirementKey.noExtendedDrivingLicense:
      return requirementsMessages.noExtendedDrivingLicenseTitle
    default:
      return requirementsMessages.rlsDefaultDeniedDescription
  }
}

// TODO: we need a better way of getting the translated string in here, outside
// of react. Possibly we should just make a more flexible results screen.
// This string ends up being used as the paramejter displayed as the error message
// for the failed dataprovider
const requirementKeyToStep = (
  key: RequirementKey,
  requirementMet: boolean,
): Omit<Step, 'state'> => {
  switch (key) {
    case RequirementKey.drivingSchoolMissing:
      return {
        title: requirementsMessages.drivingSchoolTitle,
        description: requirementsMessages.drivingSchoolDescription,
      }
    case RequirementKey.drivingAssessmentMissing:
      return {
        title: requirementsMessages.drivingAssessmentTitle,
        description: requirementsMessages.drivingAssessmentDescription,
      }
    case RequirementKey.deniedByService:
    case RequirementKey.hasDeprivation:
    case RequirementKey.hasNoSignature:
    case RequirementKey.hasPoints:
    case RequirementKey.noLicenseFound:
    case RequirementKey.personNot17YearsOld:
    case RequirementKey.personNotFoundInNationalRegistry:
    case RequirementKey.noTempLicense:
      return {
        title: requirementsMessages.rlsTitle,
        description: requirementMet
          ? requirementsMessages.rlsAcceptedDescription
          : getDeniedByServiceMessageDescription(key),
      }
    case RequirementKey.localResidency:
      return {
        title: requirementsMessages.localResidencyTitle,
        description: requirementsMessages.localResidencyDescription,
      }
    case RequirementKey.currentLocalResidency:
      return {
        title: requirementsMessages.localResidencyTitle,
        description: requirementsMessages.currentLocalResidencyDescription,
      }
    //TODO: Remove when RLS/SGS supports health certificate in BE license
    case RequirementKey.beRequiresHealthCertificate:
      return {
        title: requirementsMessages.beLicenseRequiresHealthCertificateTitle,
        description:
          requirementsMessages.beLicenseRequiresHealthCertificateDescription,
      }
    case RequirementKey.hasNoPhoto:
      return {
        title: requirementsMessages.beLicenseQualityPhotoTitle,
        description: requirementsMessages.beLicenseQualityPhotoDescription,
      }
    case RequirementKey.noExtendedDrivingLicense:
      return {
        title: requirementsMessages.noExtendedDrivingLicenseTitle,
        description: requirementsMessages.noExtendedDrivingLicenseDescription,
      }
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}
