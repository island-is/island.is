export { m } from './socialInsurance'
export { activationAllowanceMessages } from './activationAllowance'
export { sharedMessages } from './shared'
export { unemploymentBenefitsMessages } from './unemployment'

export const SHARED_NAMESPACE = 'sp.social-benefits-shared'
export const UNEMPLOYMENT_NAMESPACE = 'sp.social-benefits-unemployment'
export const SOCIAL_INSURANCE_NAMESPACE = 'sp.social-insurance-maintenance'

export const UNEMPLOYMENT_STATUS_NAMESPACES = [
  UNEMPLOYMENT_NAMESPACE,
  SHARED_NAMESPACE,
]

export const ACTIVATION_ALLOWANCE_STATUS_NAMESPACES = [
  'sp.social-benefits-activation-allowance',
  UNEMPLOYMENT_NAMESPACE,
  SHARED_NAMESPACE,
]
