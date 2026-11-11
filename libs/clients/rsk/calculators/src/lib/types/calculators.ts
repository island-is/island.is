import type {
  ChildBenefitResult,
  GetChildBenefitData,
  GetInterestBenefitData,
  GetVehicleBenefitData,
  GetVehicleDepreciationData,
  GetVehicleTaxData,
  GetWithholdingTaxData,
  InterestBenefitResult,
  TaxBracket,
  VehicleBenefitResult,
  VehicleDepreciationResult,
  VehicleTaxResult,
  WithholdingTaxResult,
} from '../../../gen/fetch'

export type ChildBenefitInput = GetChildBenefitData['query']
export type ChildBenefitOutput = ChildBenefitResult

export type InterestBenefitInput = GetInterestBenefitData['query']
export type InterestBenefitOutput = InterestBenefitResult

export type VehicleBenefitInput = GetVehicleBenefitData['query']
export type VehicleBenefitOutput = VehicleBenefitResult

export type VehicleDepreciationInput = GetVehicleDepreciationData['query']
export type VehicleDepreciationOutput = VehicleDepreciationResult

export type VehicleTaxInput = GetVehicleTaxData['query']
export type VehicleTaxOutput = VehicleTaxResult

export type WithholdingTaxInput = GetWithholdingTaxData['query']
export type WithholdingTaxBracketOutput = TaxBracket
export type WithholdingTaxOutput = WithholdingTaxResult
