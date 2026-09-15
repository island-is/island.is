import { Injectable } from '@nestjs/common'

import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../gen/fetch'
import { byName } from './contracts/byName'
import type { CalculatorContract } from './contracts/field'
import type { CalculatorOutputField } from './contracts/output'
import type { CalculatorKey } from './contracts/registry'
import { calculatorRegistry } from './contracts/registry'
import { toChildBenefitQuery } from './domains/childBenefit'
import type { ChildBenefitInput } from './domains/childBenefit'
import { toChildBenefitOutput } from './domains/childBenefit'
import { toInterestBenefitQuery } from './domains/interestBenefit'
import type { InterestBenefitInput } from './domains/interestBenefit'
import { toInterestBenefitOutput } from './domains/interestBenefit'
import { toVehicleBenefitQuery } from './domains/vehicleBenefit'
import type { VehicleBenefitInput } from './domains/vehicleBenefit'
import { toVehicleBenefitOutput } from './domains/vehicleBenefit'
import { toVehicleDepreciationQuery } from './domains/vehicleDepreciation'
import type { VehicleDepreciationInput } from './domains/vehicleDepreciation'
import { toVehicleDepreciationOutput } from './domains/vehicleDepreciation'
import { toVehicleTaxQuery } from './domains/vehicleTax'
import type { VehicleTaxInput } from './domains/vehicleTax'
import { toVehicleTaxOutput } from './domains/vehicleTax'
import { toWithholdingTaxQuery } from './domains/withholdingTax'
import type { WithholdingTaxInput } from './domains/withholdingTax'
import { toWithholdingTaxOutput } from './domains/withholdingTax'

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
