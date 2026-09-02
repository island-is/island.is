import { Injectable } from '@nestjs/common'
import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../gen/fetch'

import {
  toChildBenefitQuery,
  toInterestBenefitQuery,
  toVehicleBenefitQuery,
  toVehicleDepreciationQuery,
  toVehicleTaxQuery,
  toWithholdingTaxQuery,
} from './calculatorTypes'
import type {
  ChildBenefitInput,
  InterestBenefitInput,
  VehicleBenefitInput,
  VehicleDepreciationInput,
  VehicleTaxInput,
  WithholdingTaxInput,
} from './calculatorTypes'

@Injectable()
export class CalculatorsClientService {
  async getChildBenefit(input: ChildBenefitInput) {
    const { data } = await getChildBenefit({
      query: toChildBenefitQuery(input),
    })
    return data
  }

  async getVehicleTax(input: VehicleTaxInput) {
    const { data } = await getVehicleTax({ query: toVehicleTaxQuery(input) })
    return data
  }

  async getVehicleBenefit(input: VehicleBenefitInput) {
    const { data } = await getVehicleBenefit({
      query: toVehicleBenefitQuery(input),
    })
    return data
  }

  async getVehicleDepreciation(input: VehicleDepreciationInput) {
    const { data } = await getVehicleDepreciation({
      query: toVehicleDepreciationQuery(input),
    })
    return data
  }

  async getWithholdingTax(input?: WithholdingTaxInput) {
    const { data } = await getWithholdingTax({
      query: input && toWithholdingTaxQuery(input),
    })
    return data
  }

  async getInterestBenefit(input: InterestBenefitInput) {
    const { data } = await getInterestBenefit({
      query: toInterestBenefitQuery(input),
    })
    return data
  }
}
