import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { License } from '../../lib/constants'

export const fakeEligibility = (
  applicationFor: string,
  daysOfResidency = 365,
  requiresHealthCertificate = false, //TODO: Remove when RLS/SGS supports health certificate in BE license
): ApplicationEligibility => {
  return {
    //TODO: set to true when RLS/SGS supports health certificate in BE license
    isEligible:
      applicationFor === License.BE ? !requiresHealthCertificate : true,
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
        : //TODO: Remove when RLS/SGS supports health certificate in BE license
        applicationFor === License.BE
        ? [
            {
              key: RequirementKey.BeRequiresHealthCertificate,
              requirementMet: !requiresHealthCertificate,
            },
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
        //TODO: set to true when RLS/SGS supports health certificate in BE license
        requirementMet:
          applicationFor === License.BE ? !requiresHealthCertificate : true,
      },
    ],
  }
}
