import {
  ApplicationEligibility,
  ApplicationEligibilityRequirement,
  RequirementKey,
} from '@island.is/api/schema'

interface FakeEligibilityInput {
  categoryType?: string
  localResidency?: boolean
  deprivationDateTo?: string
  deprivationDateFrom?: string
  mentorAge?: string
  categoryIssued?: string
}

export const fakeEligibility = ({
  categoryType = 'none',
  deprivationDateTo,
  deprivationDateFrom,
  mentorAge = '20',
  categoryIssued = '2022-02-02',
}: FakeEligibilityInput): ApplicationEligibility => {
  // Make sure to update with /libs/api/domains/driving-license/src/lib/drivingLicense.service.ts section of
  // getLearnerMentorEligitibility when using this to validate logic

  const year = 1000 * 3600 * 24 * 365.25
  const twelveMonthsAgo = new Date(Date.now() - year)
  const fiveYearsAgo = new Date(Date.now() - year * 5)

  const categoryB = categoryType === 'B'

  let activeDisqualification, disqualificationInTheLastTwelveMonths

  if (deprivationDateFrom && deprivationDateTo) {
    activeDisqualification = Date.now() < Date.parse(deprivationDateTo)
    disqualificationInTheLastTwelveMonths =
      new Date(Date.parse(deprivationDateTo)) > twelveMonthsAgo
  }

  const requirements: ApplicationEligibilityRequirement[] = [
    {
      key: RequirementKey.hasDeprivation,
      requirementMet: !(
        activeDisqualification || disqualificationInTheLastTwelveMonths
      ),
    },
    {
      key: RequirementKey.personNotAtLeast24YearsOld,
      requirementMet: parseInt(mentorAge, 10) >= 24,
    },
    {
      key: RequirementKey.hasHadValidCategoryForFiveYearsOrMore,
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
