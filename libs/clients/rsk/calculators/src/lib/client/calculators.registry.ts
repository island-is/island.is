import {
  zGetChildBenefitData,
  zGetChildBenefitResponse,
  zGetInterestBenefitData,
  zGetInterestBenefitResponse,
  zGetVehicleBenefitData,
  zGetVehicleBenefitResponse,
  zGetVehicleDepreciationData,
  zGetVehicleDepreciationResponse,
  zGetVehicleTaxData,
  zGetVehicleTaxResponse,
  zGetWithholdingTaxData,
  zGetWithholdingTaxResponse,
} from '../../../gen/fetch/zod.gen'

export const calculatorRegistry = {
  childBenefit: {
    query: zGetChildBenefitData.shape.query.shape,
    result: zGetChildBenefitResponse.shape,
  },
  vehicleTax: {
    query: zGetVehicleTaxData.shape.query.shape,
    result: zGetVehicleTaxResponse.shape,
  },
  vehicleBenefit: {
    query: zGetVehicleBenefitData.shape.query.shape,
    result: zGetVehicleBenefitResponse.shape,
  },
  vehicleDepreciation: {
    query: zGetVehicleDepreciationData.shape.query.shape,
    result: zGetVehicleDepreciationResponse.shape,
  },
  withholdingTax: {
    query: zGetWithholdingTaxData.shape.query.shape,
    result: zGetWithholdingTaxResponse.shape,
  },
  interestBenefit: {
    query: zGetInterestBenefitData.shape.query.shape,
    result: zGetInterestBenefitResponse.shape,
  },
} as const

export type CalculatorKey = keyof typeof calculatorRegistry
