export { m } from './socialInsurance'
export { activationAllowanceMessages } from './activationAllowance'
export { sharedMessages } from './shared'
export { unemploymentBenefitsMessages } from './unemployment'

// The module navigation (sidebar) renders on every page in the module and uses
// messages from all three namespaces below, so each route screen must load
// them. Its social insurance entries use core messages, which the portal
// layout already loads.
export const SOCIAL_BENEFITS_NAMESPACES = [
  'sp.social-benefits-shared',
  'sp.social-benefits-unemployment',
  'sp.social-benefits-activation-allowance',
]

export const SOCIAL_INSURANCE_NAMESPACES = [
  ...SOCIAL_BENEFITS_NAMESPACES,
  'sp.social-insurance-maintenance',
]
