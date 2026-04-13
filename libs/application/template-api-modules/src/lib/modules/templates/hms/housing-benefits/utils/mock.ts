import { getValueViaPath, YES } from '@island.is/application/core'
import type { NationalRegistryIndividual } from '@island.is/application/types'

type Answers = Record<string, unknown> | undefined

/** Dev/testing address aligned with rental mock data (húsnæðisbætur assignee flow). */
export const MOCK_ASSIGNEE_NATIONAL_REGISTRY_ADDRESS = {
  city: 'Reykjavík',
  locality: 'Reykjavík',
  municipalityCode: '0000',
  postalCode: '112',
  streetAddress: 'Funafold 31',
} as const

const assigneeDevMockNatRegChecked = (answers: Answers): boolean => {
  if (
    getValueViaPath<string>(answers ?? {}, 'assigneeDevMockSettings.useMock') !==
    YES
  ) {
    return false
  }
  const natReg = getValueViaPath<string[]>(
    answers ?? {},
    'assigneeDevMockSettings.mockNationalRegistryAddress',
  )
  return Array.isArray(natReg) && natReg.includes(YES)
}

const wrongHomeRefetchNationalRegistryPending = (answers: Answers): boolean => {
  const v = getValueViaPath<string | boolean>(
    answers ?? {},
    'wrongHome.shouldRefetchNationalRegistry',
  )
  return v === 'true' || v === true
}

/**
 * Overlay mock Þjóðskrá address for assignee national registry.
 * - Prereq: assignee dev mock on + “mock national registry address” checked.
 * - Wrong-home refetch: hidden flag set when user confirmed address update but NR still mismatches (dev/local only).
 */
export const shouldOverlayMockAssigneeNationalRegistryAddress = (
  application: { answers?: Record<string, unknown> },
  options: { isDevOrLocal: boolean },
): boolean => {
  const answers = application?.answers
  if (assigneeDevMockNatRegChecked(answers)) return true
  if (options.isDevOrLocal && wrongHomeRefetchNationalRegistryPending(answers)) {
    return true
  }
  return false
}

export const applyMockAssigneeNationalRegistryAddress = <
  T extends NationalRegistryIndividual,
>(
  individual: T,
): T => ({
  ...individual,
  address: {
    ...(individual.address ?? {}),
    ...MOCK_ASSIGNEE_NATIONAL_REGISTRY_ADDRESS,
  },
})

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

