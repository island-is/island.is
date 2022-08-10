import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_RENEW,
} from '../../shared/constants'
import { isExpiring } from '../../lib/utils'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  expired?: string,
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
      ...(applicationFor === B_RENEW
        ? [
            {
              key: RequirementKey.LicenseNotRenewable,
              requirementMet: isExpiring(expired)
            },
          ]
        : []),
      {
        key: RequirementKey.DeniedByService,
        requirementMet: true,
      },
    ],
  }
}
