import { B_FULL,DrivingLicenseApplicationFor } from '../../shared/constants'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
): ApplicationEligibility => {
  return {
    isEligible: true,
    requirements: [
      ...(applicationFor === B_FULL
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
        : [
            {
              key: RequirementKey.LocalResidency,
              requirementMet: true,
            },
          ]),
      {
        key: RequirementKey.DeniedByService,
        requirementMet: true,
      },
    ],
  }
}
