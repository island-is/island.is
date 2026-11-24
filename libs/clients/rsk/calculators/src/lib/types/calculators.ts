import type {
  ChildBenefitResult,
  GetChildBenefitData,
  GetInterestBenefitData,
  GetVehicleBenefitData,
  GetVehicleDepreciationData,
  GetVehicleTaxData,
  GetWithholdingTaxData,
  InterestBenefitResult,
  VehicleBenefitResult,
  VehicleDepreciationResult,
  VehicleTaxResult,
  WithholdingTaxResult,
} from '../../../gen/fetch'
import type { CalculatorKey } from '../client/calculators.registry'

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
export type WithholdingTaxOutput = WithholdingTaxResult

interface CalculatorTypes {
  childBenefit: { input: ChildBenefitInput; output: ChildBenefitOutput }
  interestBenefit: {
    input: InterestBenefitInput
    output: InterestBenefitOutput
  }
  vehicleBenefit: { input: VehicleBenefitInput; output: VehicleBenefitOutput }
  vehicleDepreciation: {
    input: VehicleDepreciationInput
    output: VehicleDepreciationOutput
  }
  vehicleTax: { input: VehicleTaxInput; output: VehicleTaxOutput }
  withholdingTax: { input: WithholdingTaxInput; output: WithholdingTaxOutput }
}

export type CalculatorInput<K extends CalculatorKey> =
  CalculatorTypes[K]['input']
export type CalculatorOutput<K extends CalculatorKey> =
  CalculatorTypes[K]['output']

export type CalculateResult<K extends CalculatorKey> =
  | { rejected: string[]; output?: never }
  | { rejected?: never; output: CalculatorOutput<K> | undefined }
