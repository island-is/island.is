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
export type {
  VehicleTaxInput,
  VehicleTaxOutput,
} from './lib/domains/vehicleTax'
export type {
  WithholdingTaxBracketOutput,
  WithholdingTaxInput,
  WithholdingTaxOutput,
} from './lib/domains/withholdingTax'
export {
  Gjaldtimabil,
  Hjuskaparstada,
  HjuskaparstadaStadgreidsla,
  LaunGreidast,
} from '../gen/fetch'
