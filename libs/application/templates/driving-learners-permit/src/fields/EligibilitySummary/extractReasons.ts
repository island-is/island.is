import { MessageDescriptor } from 'react-intl'
import { requirementsMessages } from '../../lib/messages'
import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import { ReviewSectionState, Step } from '../../lib/constants'

export const extractReasons = (eligibility: ApplicationEligibility): Step[] => {
  return eligibility.requirements.map(({ key, requirementMet }) => ({
    ...requirementKeyToStep(key, requirementMet),
    state: requirementMet
      ? ReviewSectionState.complete
      : ReviewSectionState.requiresAction,
  }))
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
    case RequirementKey.hasNoPhoto:
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
    case RequirementKey.personNotAtLeast24YearsOld:
      return {
        title: requirementsMessages.ageRequirementTitle,
        description: requirementMet
          ? requirementsMessages.rlsAcceptedDescription
          : requirementsMessages.ageRequirementDescription,
      }
    case RequirementKey.hasHadValidCategoryForFiveYearsOrMore:
      return {
        title: requirementsMessages.validForFiveYearsTitle,
        description: requirementsMessages.validForFiveYearsDescription,
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
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}
