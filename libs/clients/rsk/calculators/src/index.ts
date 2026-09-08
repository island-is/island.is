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
export type { CalculatorKey } from './lib/contracts/registry'
export type { ChildBenefitInput } from './lib/domains/childBenefit'
export type { InterestBenefitInput } from './lib/domains/interestBenefit'
export type { VehicleBenefitInput } from './lib/domains/vehicleBenefit'
export type { VehicleDepreciationInput } from './lib/domains/vehicleDepreciation'
export type { VehicleTaxInput } from './lib/domains/vehicleTax'
export type { WithholdingTaxInput } from './lib/domains/withholdingTax'
export type {
  GetChildBenefitResponse,
  GetVehicleTaxResponse,
  GetVehicleBenefitResponse,
  GetVehicleDepreciationResponse,
  GetWithholdingTaxResponse,
  GetInterestBenefitResponse,
} from '../gen/fetch/types.gen'
