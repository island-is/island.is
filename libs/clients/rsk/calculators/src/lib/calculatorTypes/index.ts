export { getCalculatorInputProps } from './inputProps'
export type { CalculatorKey, InputProp } from './inputProps'

export { toWithholdingTaxQuery } from './withholdingTax'
export { toChildBenefitQuery } from './childBenefit'
export { toVehicleTaxQuery } from './vehicleTax'
export { toVehicleBenefitQuery } from './vehicleBenefit'
export { toVehicleDepreciationQuery } from './vehicleDepreciation'
export { toInterestBenefitQuery } from './interestBenefit'

export type {
  PaymentFrequency,
  WithholdingMaritalStatus,
  WithholdingTaxInput,
  WithholdingTaxKey,
} from './withholdingTax'
export type { ChildBenefitInput, ChildBenefitKey } from './childBenefit'
export type {
  VehicleTaxPeriod,
  VehicleTaxInput,
  VehicleTaxKey,
} from './vehicleTax'
export type { VehicleBenefitInput, VehicleBenefitKey } from './vehicleBenefit'
export type {
  VehicleDepreciationInput,
  VehicleDepreciationKey,
} from './vehicleDepreciation'
export type {
  InterestBenefitMaritalStatus,
  InterestBenefitInput,
  InterestBenefitKey,
} from './interestBenefit'
