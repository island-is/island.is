export {
  EMPLOYER_PENSION_MATCH_RATIOS,
  MARITAL_STATUSES,
  PAYMENT_FREQUENCIES,
  PENSION_FUND_RATIOS,
  PRIVATE_PENSION_RATIOS,
  withholdingTaxCalculator,
} from './definition'
export type {
  EmployerPensionMatchRatio,
  MaritalStatus,
  PaymentFrequency,
  PensionFundRatio,
  PrivatePensionRatio,
  WithholdingTaxBracketOutput,
  WithholdingTaxInput,
  WithholdingTaxOutput,
} from './definition'
export { toWithholdingTaxQuery } from './input'
export { toWithholdingTaxOutput } from './output'
