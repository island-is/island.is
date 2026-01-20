import { ApplicationEligibility, RequirementKey } from '@island.is/api/schema'
import { DrivingLicenseApplicationFor, B_FULL, BE } from '../../lib/constants'

export const fakeEligibility = (
  applicationFor: DrivingLicenseApplicationFor,
  daysOfResidency = 365,
  requiresHealthCertificate = false, //TODO: Remove when RLS/SGS supports health certificate in BE license
): ApplicationEligibility => {
  return {
    //TODO: set to true when RLS/SGS supports health certificate in BE license
    isEligible: applicationFor === BE ? !requiresHealthCertificate : true,
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
        : //TODO: Remove when RLS/SGS supports health certificate in BE license
        applicationFor === BE
        ? [
            {
              key: RequirementKey.beRequiresHealthCertificate,
              requirementMet: !requiresHealthCertificate,
            },
            {
              key: RequirementKey.localResidency,
              daysOfResidency,
              requirementMet: daysOfResidency >= 185,
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
        //TODO: set to true when RLS/SGS supports health certificate in BE license
        requirementMet:
          applicationFor === BE ? !requiresHealthCertificate : true,
      },
    ],
  }
}
