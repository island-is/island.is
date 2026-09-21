import { Injectable } from '@nestjs/common'

import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../../gen/fetch'
import { calculatorRegistry } from '../catalog/registry'
import type { CalculatorKey } from '../catalog/registry'
import { toChildBenefitOutput, toChildBenefitQuery } from '../domains/childBenefit'
import type { ChildBenefitInput } from '../domains/childBenefit'
import { toInterestBenefitOutput, toInterestBenefitQuery } from '../domains/interestBenefit'
import type { InterestBenefitInput } from '../domains/interestBenefit'
import { toVehicleBenefitOutput, toVehicleBenefitQuery } from '../domains/vehicleBenefit'
import type { VehicleBenefitInput } from '../domains/vehicleBenefit'
import { toVehicleDepreciationOutput, toVehicleDepreciationQuery } from '../domains/vehicleDepreciation'
import type { VehicleDepreciationInput } from '../domains/vehicleDepreciation'
import { toVehicleTaxOutput, toVehicleTaxQuery } from '../domains/vehicleTax'
import type { VehicleTaxInput } from '../domains/vehicleTax'
import { toWithholdingTaxOutput, toWithholdingTaxQuery } from '../domains/withholdingTax'
import type { WithholdingTaxInput } from '../domains/withholdingTax'
import type { CalculatorContract } from '../types/calculator'
import type { CalculatorOutputField } from '../types/output-field'
import { byName } from '../utils/byName'

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
      query: toChildBenefitQuery(input),
    })
    return data && toChildBenefitOutput(data)
  }

  async getVehicleTax(input: VehicleTaxInput) {
    const { data } = await getVehicleTax({ query: toVehicleTaxQuery(input) })
    return data && toVehicleTaxOutput(data)
  }

  async getVehicleBenefit(input: VehicleBenefitInput) {
    const { data } = await getVehicleBenefit({
      query: toVehicleBenefitQuery(input),
    })
    return data && toVehicleBenefitOutput(data)
  }

  async getVehicleDepreciation(input: VehicleDepreciationInput) {
    const { data } = await getVehicleDepreciation({
      query: toVehicleDepreciationQuery(input),
    })
    return data && toVehicleDepreciationOutput(data)
  }

  async getWithholdingTax(input?: WithholdingTaxInput) {
    const { data } = await getWithholdingTax({
      query: input && toWithholdingTaxQuery(input),
    })
    return data && toWithholdingTaxOutput(data)
  }

  async getInterestBenefit(input: InterestBenefitInput) {
    const { data } = await getInterestBenefit({
      query: toInterestBenefitQuery(input),
    })
    return data && toInterestBenefitOutput(data)
  }
}
