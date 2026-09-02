export { CalculatorsClientModule } from './lib/calculators.module'
export { CalculatorsClientConfig } from './lib/calculators.config'
export { CalculatorsClientService } from './lib/calculators.service'
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
} from './lib/inputs'
export type {
  GetChildBenefitResponse,
  GetVehicleTaxResponse,
  GetVehicleBenefitResponse,
  GetVehicleDepreciationResponse,
  GetWithholdingTaxResponse,
  GetInterestBenefitResponse,
} from '../gen/fetch/types.gen'
