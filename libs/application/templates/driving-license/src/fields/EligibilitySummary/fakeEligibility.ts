import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_FULL_RENEWAL_65,
  BE,
} from '../../lib/constants'

interface FakeEligibilityOptions {
  applicationFor: DrivingLicenseApplicationFor
  daysOfResidency?: number
  hasPhoto?: boolean
  hasExtendedLicense?: boolean
}

export const fakeEligibility = ({
  applicationFor,
  daysOfResidency = 365,
  hasPhoto = true,
  hasExtendedLicense = false,
}: FakeEligibilityOptions): ApplicationEligibility => {
  const requirements =
    applicationFor === B_FULL
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
      : applicationFor === B_FULL_RENEWAL_65
      ? [
          {
            key: RequirementKey.localResidency,
            daysOfResidency,
            requirementMet: daysOfResidency >= 185,
          },
          ...(hasExtendedLicense
            ? [
                {
                  key: RequirementKey.noExtendedDrivingLicense,
                  requirementMet: false,
                },
              ]
            : []),
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
        ]

  const allRequirements = [
    ...requirements,
    {
      key: RequirementKey.deniedByService,
      requirementMet: true,
    },
  ]

  return {
    isEligible: allRequirements.every((r) => r.requirementMet),
    requirements: allRequirements,
  }
}
