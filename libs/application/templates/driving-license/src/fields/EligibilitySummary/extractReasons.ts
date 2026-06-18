import { MessageDescriptor } from 'react-intl'
import { requirementsMessages } from '../../lib/messages'
import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import { ReviewSectionState, Step } from './ReviewSection'

export const extractReasons = (eligibility: ApplicationEligibility): Step[] => {
  return eligibility.requirements.map(
    ({ key, requirementMet, daysOfResidency, message }) => ({
      ...requirementKeyToStep(key, requirementMet, message ?? undefined),
      state: requirementMet
        ? ReviewSectionState.complete
        : ReviewSectionState.requiresAction,
      daysOfResidency: daysOfResidency ?? undefined,
    }),
  )
}

const getDeniedByServiceMessageDescription = (
  key: RequirementKey,
  message?: string,
): MessageDescriptor | string => {
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
      // Prefer RLS's own description for codes we don't curate ourselves; fall
      // back to the generic "contact sýslumaður" message when RLS has none.
      return message ?? requirementsMessages.rlsDefaultDeniedDescription
  }
}

// The returned description is rendered by ReviewSection. For uncurated RLS
// codes it is an already-translated string (currently Icelandic-only — see the
// eligibility resolver) rather than a MessageDescriptor; proper en/is handling
// for those strings is still a TODO.
const requirementKeyToStep = (
  key: RequirementKey,
  requirementMet: boolean,
  message?: string,
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
          : getDeniedByServiceMessageDescription(key, message),
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
      // An unmapped requirement key: prefer RLS's own description if present,
      // otherwise the generic denied message. (Previously this threw.)
      return {
        title: requirementsMessages.rlsTitle,
        description: requirementMet
          ? requirementsMessages.rlsAcceptedDescription
          : message ?? requirementsMessages.rlsDefaultDeniedDescription,
      }
  }
}
