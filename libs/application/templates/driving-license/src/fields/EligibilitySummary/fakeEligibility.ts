import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  BE,
  DrivingLicenseApplicationFor,
} from '../../lib/constants'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  daysOfResidency = 365,
  hasPhoto = true,
  is65RenewalRedesignEnabled = false,
): ApplicationEligibility => {
  const usesPhotoGate =
    applicationFor === BE ||
    (applicationFor === B_FULL_RENEWAL_65 && is65RenewalRedesignEnabled)

  return {
    isEligible: usesPhotoGate ? hasPhoto : true,
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
        : usesPhotoGate
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
