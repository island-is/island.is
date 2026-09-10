export { CalculatorsClientModule } from './lib/calculators.module'
export { CalculatorsClientConfig } from './lib/calculators.config'
export { CalculatorsClientService } from './lib/calculators.service'
export type {
  CalculatorContract,
  CalculatorField,
  CalculatorFieldDependency,
  CalculatorFieldOption,
  CalculatorFieldSemantic,
  CalculatorFieldType,
} from './lib/contracts/field'
export type {
  CalculatorArrayOutputField,
  CalculatorOutputField,
  CalculatorOutputScalarType,
  CalculatorScalarOutputField,
} from './lib/contracts/output'
export type { CalculatorKey } from './lib/contracts/registry'
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
export type {
  VehicleTaxInput,
  VehicleTaxOutput,
} from './lib/domains/vehicleTax'
export type {
  WithholdingTaxBracketOutput,
  WithholdingTaxInput,
  WithholdingTaxOutput,
} from './lib/domains/withholdingTax'
