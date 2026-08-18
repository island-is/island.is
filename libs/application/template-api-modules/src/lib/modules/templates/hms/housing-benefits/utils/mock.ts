import { getValueViaPath, YES } from '@island.is/application/core'
import type { NationalRegistryIndividual } from '@island.is/application/types'
import * as kennitala from 'kennitala'

type Answers = Record<string, unknown> | undefined

/** Dev/testing address aligned with rental mock data (húsnæðisbætur assignee flow). */
export const MOCK_ASSIGNEE_NATIONAL_REGISTRY_ADDRESS = {
  city: 'Reykjavík',
  locality: 'Reykjavík',
  municipalityCode: '0000',
  postalCode: '112',
  streetAddress: 'Funafold 31',
} as const

/**
 * Assignee dev mock form fields are stored under
 * `<nationalId>.assigneeDevMockSettings.*` (see nationalIdPreface in the template),
 * not at root `assigneeDevMockSettings`.
 */
const assigneeDevMockNatRegChecked = (
  answers: Answers,
  nationalId: string | undefined,
): boolean => {
  if (!nationalId?.trim()) {
    return false
  }
  const normalized = kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId.trim()
  const prefix = `${normalized}.assigneeDevMockSettings`
  if (getValueViaPath<string>(answers ?? {}, `${prefix}.useMock`) !== YES) {
    return false
  }
  const natReg = getValueViaPath<string[]>(
    answers ?? {},
    `${prefix}.mockNationalRegistryAddress`,
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
  /** Current assignee (API caller) — required for the dev mock checkbox to apply. */
  nationalId?: string,
): boolean => {
  const answers = application?.answers
  if (assigneeDevMockNatRegChecked(answers, nationalId)) return true
  if (
    options.isDevOrLocal &&
    wrongHomeRefetchNationalRegistryPending(answers)
  ) {
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

/**
 * Dev/local tax-return mock mode for the housing-benefits dataprovider.
 *
 * - `none`: call the real HMS tax API
 * - `sample`: filed last year (and therefore also within last five years)
 * - `empty`: never filed (manual income/asset declaration path)
 * - `fiveYears`: filed within last five years, but not last year
 *   (routes to the tax-return-required dead-end)
 */
export type PersonalTaxMockMode = 'none' | 'sample' | 'empty' | 'fiveYears'

/** Any mock mode other than `none` — i.e. resolve locally, never hit the tax API. */
export type EnabledPersonalTaxMockMode = Exclude<PersonalTaxMockMode, 'none'>

/** Shape stored under `externalData.getPersonalTaxReturn` / assignee tax return. */
export type PersonalTaxReturnResult = {
  handedInLastYear: boolean
  handedInLastFiveYears: boolean
}

/** Maps UI radio values (`emptySuccess`, `filedWithinFiveYears`, …) to mock modes. */
const mapTaxVariant = (variant: string | undefined): PersonalTaxMockMode => {
  if (variant === 'emptySuccess') return 'empty'
  if (variant === 'filedWithinFiveYears') return 'fiveYears'
  return 'sample'
}

/** Type guard: true when a mock variant is selected and the tax API must be skipped. */
export const isPersonalTaxMockEnabled = (
  taxMockMode: PersonalTaxMockMode,
): taxMockMode is EnabledPersonalTaxMockMode => taxMockMode !== 'none'

/**
 * Builds a successful tax dataprovider payload for the selected mock mode.
 *
 * Important: all non-`none` modes (including `sample` / `withSampleData`) must
 * resolve here. Previously `sample` fell through to the real API, so 500s /
 * connection failures still marked the provider as failed and blocked the UI
 * even when the user had opted into mocking.
 */
export const resolveMockPersonalTaxReturn = (
  taxMockMode: EnabledPersonalTaxMockMode,
): PersonalTaxReturnResult => {
  switch (taxMockMode) {
    case 'empty':
      return { handedInLastYear: false, handedInLastFiveYears: false }
    case 'fiveYears':
      return { handedInLastYear: false, handedInLastFiveYears: true }
    case 'sample':
    default:
      return { handedInLastYear: true, handedInLastFiveYears: true }
  }
}

/**
 * Applicant mock mode from `devMockSettings.*` (or legacy `mockData`).
 * Returns `none` unless mock is on and the tax checkbox is checked.
 */
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
  return mapTaxVariant(variant)
}

/**
 * Assignee mock mode from `<nationalId>.assigneeDevMockSettings.*`
 * (field ids are nationalId-prefixed via `nationalIdPreface`).
 */
export const getAssigneePersonalTaxMockMode = (
  application: { answers?: Record<string, unknown> },
  nationalId: string,
): PersonalTaxMockMode => {
  const answers = application?.answers
  const prefix = `${nationalId}.assigneeDevMockSettings`
  if (getValueViaPath<string>(answers ?? {}, `${prefix}.useMock`) !== YES) {
    return 'none'
  }
  const tax = getValueViaPath<string[]>(
    answers ?? {},
    `${prefix}.mockTaxReturn`,
  )
  if (!Array.isArray(tax) || !tax.includes(YES)) return 'none'
  const variant = getValueViaPath<string>(
    answers ?? {},
    `${prefix}.mockTaxReturnVariant`,
  )
  return mapTaxVariant(variant)
}
