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
  CalculatorObjectOutputField,
  CalculatorOutputField,
  CalculatorOutputScalarType,
  CalculatorScalarOutputField,
} from './lib/types/output-field'
export type { CalculatorKey } from './lib/client/calculators.registry'
export type {
  ChildBenefitInput,
  ChildBenefitOutput,
  InterestBenefitInput,
  InterestBenefitOutput,
  VehicleBenefitInput,
  VehicleBenefitOutput,
  VehicleDepreciationInput,
  VehicleDepreciationOutput,
  VehicleTaxInput,
  VehicleTaxOutput,
  WithholdingTaxBracketOutput,
  WithholdingTaxInput,
  WithholdingTaxOutput,
} from './lib/types/calculators'
export {
  Gjaldtimabil,
  Hjuskaparstada,
  HjuskaparstadaStadgreidsla,
  LaunGreidast,
  Manudur,
} from '../gen/fetch'
