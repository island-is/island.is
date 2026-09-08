import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import { B_FULL, DrivingLicenseApplicationFor } from '../../utils/constants'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  daysOfResidency = 365,
  hasPhoto = true,
): ApplicationEligibility => {
  // Every product requires a usable photo, so eligibility tracks it directly.
  return {
    isEligible: hasPhoto,
    requirements: [
      ...(applicationFor === B_FULL
        ? [
            {
              key: RequirementKey.drivingAssessmentMissing,
              requirementMet: true,
            },
            {
              key: RequirementKey.drivingSchoolMissing,
              requirementMet: true,
            },
            {
              key: RequirementKey.hasNoPhoto,
              requirementMet: hasPhoto,
            },
          ]
        : [
            {
              key: RequirementKey.localResidency,
              daysOfResidency,
              requirementMet: daysOfResidency >= 185,
            },
            {
              key: RequirementKey.hasNoPhoto,
              requirementMet: hasPhoto,
            },
          ]),
      {
        key: RequirementKey.deniedByService,
        requirementMet: true,
      },
    ],
  }
}
