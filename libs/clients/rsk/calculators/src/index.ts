export { CalculatorsClientModule } from './lib/client/calculators.module'
export { CalculatorsClientConfig } from './lib/client/calculators.config'
export { CalculatorsClientService } from './lib/client/calculators.service'
export type {
  CalculatorField,
  CalculatorFieldDependency,
  CalculatorFieldOption,
  CalculatorFieldType,
} from './lib/types/input-field'
export type { CalculatorContract } from './lib/types/calculator'
export type { CalculatorFieldSemantic } from './lib/types/semantic'
export type {
  CalculatorArrayOutputField,
  CalculatorOutputField,
  CalculatorOutputScalarType,
  CalculatorScalarOutputField,
} from './lib/types/output-field'
export type { CalculatorKey } from './lib/catalog/registry'
export type {
  ChildBenefitInput,
  ChildBenefitOutput,
} from './lib/domains/childBenefit'
export type {
  InterestBenefitInput,
  InterestBenefitOutput,
} from './lib/domains/interestBenefit'
export type {
  VehicleBenefitInput,
  VehicleBenefitOutput,
} from './lib/domains/vehicleBenefit'
export type {
  VehicleDepreciationInput,
  VehicleDepreciationOutput,
} from './lib/domains/vehicleDepreciation'
export { VEHICLE_TAX_PERIODS } from './lib/domains/vehicleTax'
export type {
  VehicleTaxInput,
  VehicleTaxOutput,
  VehicleTaxPeriod,
} from './lib/domains/vehicleTax'
export {
  EMPLOYER_PENSION_MATCH_RATIOS,
  MARITAL_STATUSES,
  PAYMENT_FREQUENCIES,
  PENSION_FUND_RATIOS,
  PRIVATE_PENSION_RATIOS,
} from './lib/domains/withholdingTax'
export type {
  EmployerPensionMatchRatio,
  MaritalStatus,
  PaymentFrequency,
  PensionFundRatio,
  PrivatePensionRatio,
  WithholdingTaxBracketOutput,
  WithholdingTaxInput,
  WithholdingTaxOutput,
} from './lib/domains/withholdingTax'
