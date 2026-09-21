import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  BE,
  DrivingLicenseApplicationFor,
} from '../../lib/constants'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  daysOfResidency = 365,
  hasPhoto = true,
  is65RenewalRedesignEnabled = false,
  isBTempRedesignEnabled = false,
  isBFullRedesignEnabled = false,
): ApplicationEligibility => {
  const usesPhotoGate =
    applicationFor === BE ||
    (applicationFor === B_FULL_RENEWAL_65 && is65RenewalRedesignEnabled) ||
    (applicationFor === B_TEMP && isBTempRedesignEnabled) ||
    (applicationFor === B_FULL && isBFullRedesignEnabled)

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
            // When the B-full redesign is on, a usable photo is also required.
            ...(isBFullRedesignEnabled
              ? [
                  {
                    key: RequirementKey.hasNoPhoto,
                    requirementMet: hasPhoto,
                  },
                ]
              : []),
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
