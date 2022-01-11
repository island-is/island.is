import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { DrivingLicenseApplicationFor, B_FULL } from '../../shared/constants'

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
