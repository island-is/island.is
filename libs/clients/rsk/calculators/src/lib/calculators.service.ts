import { Injectable } from '@nestjs/common'
import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../gen/fetch'
import type {
  GetChildBenefitData,
  GetInterestBenefitData,
  GetVehicleBenefitData,
  GetVehicleDepreciationData,
  GetVehicleTaxData,
  GetWithholdingTaxData,
} from '../../gen/fetch'

@Injectable()
export class CalculatorsClientService {
  async getChildBenefit(query: GetChildBenefitData['query']) {
    const { data } = await getChildBenefit({ query })
    return data
  }

  async getVehicleTax(query: GetVehicleTaxData['query']) {
    const { data } = await getVehicleTax({ query })
    return data
  }

  async getVehicleBenefit(query: GetVehicleBenefitData['query']) {
    const { data } = await getVehicleBenefit({ query })
    return data
  }

  async getVehicleDepreciation(query: GetVehicleDepreciationData['query']) {
    const { data } = await getVehicleDepreciation({ query })
    return data
  }

  async getWithholdingTax(query?: GetWithholdingTaxData['query']) {
    const { data } = await getWithholdingTax({ query })
    return data
  }

  async getInterestBenefit(query: GetInterestBenefitData['query']) {
    const { data } = await getInterestBenefit({ query })
    return data
  }
}
