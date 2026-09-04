export { getCalculatorInputProps } from './inputProps'
export type { CalculatorKey, InputProp } from './inputProps'

export { toWithholdingTaxQuery } from './withholdingTax'
export { toChildBenefitQuery } from './childBenefit'
export { toVehicleTaxQuery } from './vehicleTax'
export { toVehicleBenefitQuery } from './vehicleBenefit'
export { toVehicleDepreciationQuery } from './vehicleDepreciation'
export { toInterestBenefitQuery } from './interestBenefit'

export type {
  InterestBenefitMaritalStatus,
  PaymentFrequency,
  VehicleTaxPeriod,
  WithholdingMaritalStatus,
} from './constants'
export type { WithholdingTaxInput, WithholdingTaxKey } from './withholdingTax'
export type { ChildBenefitInput, ChildBenefitKey } from './childBenefit'
export type { VehicleTaxInput, VehicleTaxKey } from './vehicleTax'
export type { VehicleBenefitInput, VehicleBenefitKey } from './vehicleBenefit'
export type {
  VehicleDepreciationInput,
  VehicleDepreciationKey,
} from './vehicleDepreciation'
export type {
  InterestBenefitInput,
  InterestBenefitKey,
} from './interestBenefit'
