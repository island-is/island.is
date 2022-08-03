import {
  ApplicationEligibility,
  ApplicationEligibilityRequirement,
  RequirementKey,
} from '../../types/schema'
import { DrivingLicenseApplicationFor, B_FULL } from '../../shared/constants'

export const fakeEligibility = ({
  categoryType = 'none',
  localResidency = true,
  deprivationDateTo = '2022-02-02',
  mentorAge = '20',
  categoryIssued = '2022-02-02',
}): ApplicationEligibility => {
  // Make sure to update with /libs/api/domains/driving-license/src/lib/drivingLicense.service.ts section of
  // getLearnerMentorEligitibility when using this to validate logic

  const fiveYearsAgo = new Date(Date.now() - 1000 * 3600 * 24 * 365.25 * 5)
  const categoryB =
    categoryType === 'B'
      ? {
          issued: categoryIssued,
        }
      : null
  const license = {
    disqualification: {
      to: new Date(Date.parse(deprivationDateTo)),
    },
  }

  const requirements: ApplicationEligibilityRequirement[] = [
    {
      key: RequirementKey.HasDeprivation,
      requirementMet: license?.disqualification?.to
        ? Date.now() > license.disqualification.to.getTime()
        : true,
    },
    {
      key: RequirementKey.CurrentLocalResidency,
      requirementMet: localResidency,
    },
    {
      key: RequirementKey.PersonNotAtLeast24YearsOld,
      requirementMet: parseInt(mentorAge, 10) >= 24,
    },
    {
      key: RequirementKey.HasHadValidCategoryForFiveYearsOrMore,
      requirementMet:
        categoryB && categoryB.issued
          ? new Date(Date.parse(categoryB.issued)) < fiveYearsAgo
          : false,
    },
  ]
  // only eligible if we dont find an unmet requirement
  const isEligible = !requirements.find(
    ({ requirementMet }) => requirementMet === false,
  )

  return {
    requirements,
    isEligible,
  }
}
