import { Injectable } from '@nestjs/common'

import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../../gen/fetch'
import type { CalculatorKey } from './calculators.registry'
import { calculatorRegistry } from './calculators.registry'
import { fromClientResult } from './fromClientResult'
import { toClientQuery } from './toClientQuery'
import { toInputFields } from '../contract/toInputFields'
import { toOutputFields } from '../contract/toOutputFields'
import type { CalculatorContract } from '../types/calculator'
import type {
  ChildBenefitInput,
  InterestBenefitInput,
  VehicleBenefitInput,
  VehicleDepreciationInput,
  VehicleTaxInput,
  WithholdingTaxInput,
} from '../types/calculators'
import { byName } from '../utils/byName'

const { childBenefit, interestBenefit, vehicleBenefit, vehicleDepreciation, vehicleTax, withholdingTax } =
  calculatorRegistry

@Injectable()
export class CalculatorsClientService {
  getCalculator(key: CalculatorKey): CalculatorContract<CalculatorKey> {
    const calculator = calculatorRegistry[key]

    if (!calculator) {
      throw new Error(`Unknown calculator key: ${key}`)
    }

    return {
      key,
      inputFields: toInputFields(calculator.query).sort(byName),
      outputFields: toOutputFields(calculator.result)
        .map((field) =>
          field.kind === 'scalar'
            ? field
            : { ...field, itemFields: [...field.itemFields].sort(byName) },
        )
        .sort(byName),
    }
  }

  async getChildBenefit(input: ChildBenefitInput) {
    const { data } = await getChildBenefit({
      query: toClientQuery(childBenefit.query, input),
    })
    return data && fromClientResult(childBenefit.result, data)
  }

  async getVehicleTax(input: VehicleTaxInput) {
    const { data } = await getVehicleTax({
      query: toClientQuery(vehicleTax.query, input),
    })
    return data && fromClientResult(vehicleTax.result, data)
  }

  async getVehicleBenefit(input: VehicleBenefitInput) {
    const { data } = await getVehicleBenefit({
      query: toClientQuery(vehicleBenefit.query, input),
    })
    return data && fromClientResult(vehicleBenefit.result, data)
  }

  async getVehicleDepreciation(input: VehicleDepreciationInput) {
    const { data } = await getVehicleDepreciation({
      query: toClientQuery(vehicleDepreciation.query, input),
    })
    return data && fromClientResult(vehicleDepreciation.result, data)
  }

  async getWithholdingTax(input: WithholdingTaxInput) {
    const { data } = await getWithholdingTax({
      query: toClientQuery(withholdingTax.query, input),
    })
    return data && fromClientResult(withholdingTax.result, data)
  }

  async getInterestBenefit(input: InterestBenefitInput) {
    const { data } = await getInterestBenefit({
      query: toClientQuery(interestBenefit.query, input),
    })
    return data && fromClientResult(interestBenefit.result, data)
  }
}
