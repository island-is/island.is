import { m } from '../../lib/messages'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { ReviewSectionState, Step } from './ReviewSection'

export const extractReasons = (eligibility: ApplicationEligibility): Step[] => {
  return eligibility.requirements.map(({ key, requirementMet }) =>
    requirementKeyToStep(key, requirementMet),
  )
}

// TODO: we need a better way of getting the translated string in here, outside
// of react. Possibly we should just make a more flexible results screen.
// This string ends up being used as the paramejter displayed as the error message
// for the failed dataprovider
const requirementKeyToStep = (key: string, isRequirementMet: boolean): Step => {
  const step = {
    state: isRequirementMet
      ? ReviewSectionState.complete
      : ReviewSectionState.requiresAction,
  }

  switch (key) {
    case RequirementKey.DrivingSchoolMissing:
      return {
        ...step,
        title: m.requirementUnmetDrivingSchoolTitle,
        description: m.requirementUnmetDrivingSchoolDescription,
      }
    case RequirementKey.DrivingAssessmentMissing:
      return {
        ...step,
        title: m.requirementUnmetDrivingAssessmentTitle,
        description: m.requirementUnmetDrivingAssessmentDescription,
      }
    case RequirementKey.DeniedByService:
      return {
        ...step,
        title: m.requirementUnmetDeniedByServiceTitle,
        description: m.requirementUnmetDeniedByServiceDescription,
      }
    case RequirementKey.LocalResidency:
      return {
        ...step,
        title: m.requirementUnmetLocalResidencyTitle,
        description: m.requirementUnmetLocalResidencyDescription,
      }
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}
