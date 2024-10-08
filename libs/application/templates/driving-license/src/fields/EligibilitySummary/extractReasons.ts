import { MessageDescriptor } from 'react-intl'
import { requirementsMessages } from '../../lib/messages'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'
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
    case RequirementKey.NoLicenseFound:
    case RequirementKey.NoTempLicense:
      return requirementsMessages.invalidLicense
    case RequirementKey.HasDeprivation:
    case RequirementKey.HasPoints:
      return requirementsMessages.hasPointsOrDeprivation
    case RequirementKey.NoExtendedDrivingLicense:
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
    case RequirementKey.DrivingSchoolMissing:
      return {
        title: requirementsMessages.drivingSchoolTitle,
        description: requirementsMessages.drivingSchoolDescription,
      }
    case RequirementKey.DrivingAssessmentMissing:
      return {
        title: requirementsMessages.drivingAssessmentTitle,
        description: requirementsMessages.drivingAssessmentDescription,
      }
    case RequirementKey.DeniedByService:
    case RequirementKey.HasDeprivation:
    case RequirementKey.HasNoSignature:
    case RequirementKey.HasPoints:
    case RequirementKey.NoLicenseFound:
    case RequirementKey.PersonNot17YearsOld:
    case RequirementKey.PersonNotFoundInNationalRegistry:
    case RequirementKey.NoTempLicense:
      return {
        title: requirementsMessages.rlsTitle,
        description: requirementMet
          ? requirementsMessages.rlsAcceptedDescription
          : getDeniedByServiceMessageDescription(key),
      }
    case RequirementKey.LocalResidency:
      return {
        title: requirementsMessages.localResidencyTitle,
        description: requirementsMessages.localResidencyDescription,
      }
    case RequirementKey.CurrentLocalResidency:
      return {
        title: requirementsMessages.localResidencyTitle,
        description: requirementsMessages.currentLocalResidencyDescription,
      }
    //TODO: Remove when RLS/SGS supports health certificate in BE license
    case RequirementKey.BeRequiresHealthCertificate:
      return {
        title: requirementsMessages.beLicenseRequiresHealthCertificateTitle,
        description:
          requirementsMessages.beLicenseRequiresHealthCertificateDescription,
      }
    case RequirementKey.HasNoPhoto:
      return {
        title: requirementsMessages.beLicenseQualityPhotoTitle,
        description: requirementsMessages.beLicenseQualityPhotoDescription,
      }
    case RequirementKey.NoExtendedDrivingLicense:
      return {
        title: requirementsMessages.noExtendedDrivingLicenseTitle,
        description: requirementsMessages.noExtendedDrivingLicenseDescription,
      }
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}
