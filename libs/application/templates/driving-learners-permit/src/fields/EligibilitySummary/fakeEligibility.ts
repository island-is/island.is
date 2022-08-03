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
  deprivationDateFrom = '2022-02-02',
  mentorAge = '20',
  categoryIssued = '2022-02-02',
}): ApplicationEligibility => {
  // Make sure to update with /libs/api/domains/driving-license/src/lib/drivingLicense.service.ts section of
  // getLearnerMentorEligitibility when using this to validate logic

  const year = 1000 * 3600 * 24 * 365.25
  const twelveMonthsAgo = new Date(Date.now() - year)
  const fiveYearsAgo = new Date(Date.now() - year * 5)

  const categoryB = categoryType === 'B'

  const activeDisqualification = Date.now() < Date.parse(deprivationDateTo)
  const disqualificationInTheLastTwelveMonths =
    new Date(Date.parse(deprivationDateFrom)) > twelveMonthsAgo

  const requirements: ApplicationEligibilityRequirement[] = [
    {
      key: RequirementKey.HasDeprivation,
      requirementMet: !(
        activeDisqualification || disqualificationInTheLastTwelveMonths
      ),
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
      requirementMet: categoryB
        ? new Date(Date.parse(categoryIssued)) < fiveYearsAgo
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
