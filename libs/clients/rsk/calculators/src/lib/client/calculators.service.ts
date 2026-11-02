import { Injectable } from '@nestjs/common'

import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../../gen/fetch'
import {
  zGetChildBenefitData,
  zGetChildBenefitResponse,
  zGetInterestBenefitResponse,
  zGetVehicleBenefitResponse,
  zGetVehicleDepreciationResponse,
  zGetVehicleTaxData,
  zGetVehicleTaxResponse,
  zGetWithholdingTaxData,
  zGetWithholdingTaxResponse,
} from '../../../gen/fetch/zod.gen'
import type { CalculatorKey } from '../catalog/registry'
import { calculatorRegistry } from '../catalog/registry'
import type { ChildBenefitInput } from '../domains/childBenefit'
import type { InterestBenefitInput } from '../domains/interestBenefit'
import { toInterestBenefitQuery } from '../domains/interestBenefit'
import type { VehicleBenefitInput } from '../domains/vehicleBenefit'
import { toVehicleBenefitQuery } from '../domains/vehicleBenefit'
import type { VehicleDepreciationInput } from '../domains/vehicleDepreciation'
import { toVehicleDepreciationQuery } from '../domains/vehicleDepreciation'
import type { VehicleTaxInput } from '../domains/vehicleTax'
import type { WithholdingTaxInput } from '../domains/withholdingTax'
import type { CalculatorContract } from '../types/calculator'
import type { CalculatorOutputField } from '../types/output-field'
import { byName } from '../utils/byName'
import { fromClientResult } from '../utils/fromClientResult'
import { toClientQuery } from '../utils/toClientQuery'

@Injectable()
export class CalculatorsClientService {
  getCalculator(key: CalculatorKey): CalculatorContract<CalculatorKey> {
    const calculator = calculatorRegistry[key]

    if (!calculator) {
      throw new Error(`Unknown calculator key: ${key}`)
    }

    const outputFields: readonly CalculatorOutputField[] =
      calculator.outputFields

    return {
      key: calculator.key,
      inputFields: [...calculator.inputFields].sort(byName),
      outputFields: [...outputFields]
        .map((field) =>
          field.kind === 'array'
            ? { ...field, itemFields: [...field.itemFields].sort(byName) }
            : field,
        )
        .sort(byName),
    }
  }

  async getChildBenefit(input: ChildBenefitInput) {
    const { data } = await getChildBenefit({
      query: toClientQuery(zGetChildBenefitData.shape.query.shape, input),
    })
    return data && fromClientResult(zGetChildBenefitResponse.shape, data)
  }

  async getVehicleTax(input: VehicleTaxInput) {
    const { data } = await getVehicleTax({
      query: toClientQuery(zGetVehicleTaxData.shape.query.shape, input),
    })
    return data && fromClientResult(zGetVehicleTaxResponse.shape, data)
  }

  async getVehicleBenefit(input: VehicleBenefitInput) {
    const { data } = await getVehicleBenefit({
      query: toVehicleBenefitQuery(input),
    })
    return data && fromClientResult(zGetVehicleBenefitResponse.shape, data)
  }

  async getVehicleDepreciation(input: VehicleDepreciationInput) {
    const { data } = await getVehicleDepreciation({
      query: toVehicleDepreciationQuery(input),
    })
    return data && fromClientResult(zGetVehicleDepreciationResponse.shape, data)
  }

  async getWithholdingTax(input: WithholdingTaxInput) {
    const { data } = await getWithholdingTax({
      query: toClientQuery(zGetWithholdingTaxData.shape.query.shape, input),
    })
    return data && fromClientResult(zGetWithholdingTaxResponse.shape, data)
  }

  async getInterestBenefit(input: InterestBenefitInput) {
    const { data } = await getInterestBenefit({
      query: toInterestBenefitQuery(input),
    })
    return data && fromClientResult(zGetInterestBenefitResponse.shape, data)
  }
}
