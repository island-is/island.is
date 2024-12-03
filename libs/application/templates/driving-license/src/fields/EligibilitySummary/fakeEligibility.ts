import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { License } from '../../lib/constants'

export const fakeEligibility = (
  applicationFor: string,
  daysOfResidency = 365,
): ApplicationEligibility => {
  return {
    isEligible: true,
    requirements: [
      ...(applicationFor === License.B_FULL
        ? [
            {
              key: RequirementKey.DrivingAssessmentMissing,
              requirementMet: true,
            },
            {
              key: RequirementKey.DrivingSchoolMissing,
              requirementMet: true,
            },
          ]
        : applicationFor === License.BE
        ? [
            {
              key: RequirementKey.LocalResidency,
              daysOfResidency,
              requirementMet: daysOfResidency >= 185,
            },
          ]
        : [
            {
              key: RequirementKey.LocalResidency,
              daysOfResidency,
              requirementMet: daysOfResidency >= 185,
            },
          ]),
      {
        key: RequirementKey.DeniedByService,
        requirementMet: true,
      },
    ],
  }
}
