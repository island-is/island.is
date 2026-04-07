import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import { DrivingLicenseApplicationFor, B_FULL, BE } from '../../lib/constants'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  daysOfResidency = 365,
  hasPhoto = true,
): ApplicationEligibility => {
  return {
    isEligible: applicationFor === BE ? hasPhoto : true,
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
          ]
        : applicationFor === BE
        ? [
            {
              key: RequirementKey.localResidency,
              daysOfResidency,
              requirementMet: daysOfResidency >= 185,
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
          ]),
      {
        key: RequirementKey.deniedByService,
        requirementMet: true,
      },
    ],
  }
}
