import { getValueViaPath, YES } from '@island.is/application/core'

type Answers = Record<string, unknown> | undefined

const legacyMockEnabled = (answers: Answers): boolean => {
  const mockData = getValueViaPath<string[]>(answers ?? {}, 'mockData')
  return Array.isArray(mockData) && mockData.includes('yes')
}

const devMockUseMock = (answers: Answers): boolean =>
  getValueViaPath<string>(answers ?? {}, 'devMockSettings.useMock') === YES

/** True when user opted into dev mock UI (new flow) or legacy mockData checkbox. */
export const isDevOrLegacyMockEnabled = (application: {
  answers?: Record<string, unknown>
}): boolean => {
  const answers = application?.answers
  if (legacyMockEnabled(answers)) return true
  return devMockUseMock(answers)
}

/** Mock rental list when legacy mock, or new flow with dev mock on + rental checkbox. */
export const useMockRentalAgreements = (application: {
  answers?: Record<string, unknown>
}): boolean => {
  const answers = application?.answers
  if (legacyMockEnabled(answers)) return true
  if (!devMockUseMock(answers)) return false
  const rental = getValueViaPath<string[]>(
    answers ?? {},
    'devMockSettings.mockRentalAgreements',
  )
  return Array.isArray(rental) && rental.includes(YES)
}

export type PersonalTaxMockMode = 'none' | 'sample' | 'empty'

/** Real Skattur API unless legacy mock (sample) or new flow with tax mock + variant. */
export const getPersonalTaxMockMode = (application: {
  answers?: Record<string, unknown>
}): PersonalTaxMockMode => {
  const answers = application?.answers
  if (legacyMockEnabled(answers)) return 'sample'
  if (!devMockUseMock(answers)) return 'none'
  const tax = getValueViaPath<string[]>(
    answers ?? {},
    'devMockSettings.mockTaxReturn',
  )
  if (!Array.isArray(tax) || !tax.includes(YES)) return 'none'
  const variant = getValueViaPath<string>(
    answers ?? {},
    'devMockSettings.mockTaxReturnVariant',
  )
  return variant === 'emptySuccess' ? 'empty' : 'sample'
}

/** Shape returned by HousingBenefitsService.getPersonalTaxReturn (persisted under externalData.getPersonalTaxReturn.data). */
export type MockPersonalTaxReturnPayload = {
  year: number
  directTaxPayments: {
    totalSalary: number
    payerNationalId: string
    personalAllowance: number
    withheldAtSource: number
    month: number
    year: number
  }[]
}

export const getMockPersonalTaxReturn = (
  year: number,
): MockPersonalTaxReturnPayload => ({
  year,
  directTaxPayments: [
    {
      totalSalary: 450_000,
      payerNationalId: '5402696029',
      personalAllowance: 58_084,
      withheldAtSource: 112_500,
      month: 1,
      year,
    },
    {
      totalSalary: 450_000,
      payerNationalId: '5402696029',
      personalAllowance: 58_084,
      withheldAtSource: 112_500,
      month: 2,
      year,
    },
    {
      totalSalary: 462_000,
      payerNationalId: '5402696029',
      personalAllowance: 58_084,
      withheldAtSource: 115_500,
      month: 3,
      year,
    },
  ],
})

export const getEmptyMockPersonalTaxReturn = (
  year: number,
): MockPersonalTaxReturnPayload => ({
  year,
  directTaxPayments: [],
})
