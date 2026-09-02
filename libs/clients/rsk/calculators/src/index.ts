export { CalculatorsClientModule } from './lib/calculators.module'
export { CalculatorsClientConfig } from './lib/calculators.config'
export { CalculatorsClientService } from './lib/calculators.service'
export type { CalculatorKey, InputProp } from './lib/calculatorTypes'
export { getCalculatorInputProps } from './lib/calculatorTypes'
export type {
  ChildBenefitInput,
  ChildBenefitKey,
  InterestBenefitInput,
  InterestBenefitKey,
  InterestBenefitMaritalStatus,
  PaymentFrequency,
  VehicleBenefitInput,
  VehicleBenefitKey,
  VehicleDepreciationInput,
  VehicleDepreciationKey,
  VehicleTaxInput,
  VehicleTaxKey,
  VehicleTaxPeriod,
  WithholdingMaritalStatus,
  WithholdingTaxInput,
  WithholdingTaxKey,
} from './lib/calculatorTypes'
export type {
  GetChildBenefitResponse,
  GetVehicleTaxResponse,
  GetVehicleBenefitResponse,
  GetVehicleDepreciationResponse,
  GetWithholdingTaxResponse,
  GetInterestBenefitResponse,
} from '../gen/fetch/types.gen'
