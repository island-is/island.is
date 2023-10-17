import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { DrivingLicenseApplicationFor, B_FULL } from '../../shared/constants'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  daysOfResidency = 365,
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
