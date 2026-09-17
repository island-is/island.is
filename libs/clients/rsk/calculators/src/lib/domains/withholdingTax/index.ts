export {
  EMPLOYER_PENSION_MATCH_RATIOS,
  MARITAL_STATUSES,
  PAYMENT_FREQUENCIES,
  PENSION_FUND_RATIOS,
  PRIVATE_PENSION_RATIOS,
  withholdingTaxCalculator,
} from './contract'
export type {
  EmployerPensionMatchRatio,
  MaritalStatus,
  PaymentFrequency,
  PensionFundRatio,
  PrivatePensionRatio,
  WithholdingTaxBracketOutput,
  WithholdingTaxInput,
  WithholdingTaxOutput,
} from './contract'
export { toWithholdingTaxQuery } from './withholdingTax'
export { toWithholdingTaxOutput } from './withholdingTaxOutput'
