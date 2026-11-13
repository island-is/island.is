import { Injectable } from '@nestjs/common'

import {
  getChildBenefit,
  getInterestBenefit,
  getVehicleBenefit,
  getVehicleDepreciation,
  getVehicleTax,
  getWithholdingTax,
} from '../../../gen/fetch'
import { toInputFields } from '../contract/toInputFields'
import { toOutputFields } from '../contract/toOutputFields'
import type { CalculatorContract } from '../types/calculator'
import type {
  CalculateResult,
  CalculatorInput,
  CalculatorOutput,
  ChildBenefitInput,
  InterestBenefitInput,
  VehicleBenefitInput,
  VehicleDepreciationInput,
  VehicleTaxInput,
  WithholdingTaxInput,
} from '../types/calculators'
import { byName } from '../utils/byName'
import type { CalculatorKey } from './calculators.registry'
import { calculatorRegistry } from './calculators.registry'
import { fromClientResult } from './fromClientResult'
import { invalidClientQueryFields } from './invalidClientQueryFields'
import { parseClientQuery } from './parseClientQuery'
import { toClientQuery } from './toClientQuery'

const {
  childBenefit,
  interestBenefit,
  vehicleBenefit,
  vehicleDepreciation,
  vehicleTax,
  withholdingTax,
} = calculatorRegistry

const endpoints: {
  [K in CalculatorKey]: (
    query: CalculatorInput<K>,
  ) => Promise<CalculatorOutput<K> | undefined>
} = {
  childBenefit: async (query) => (await getChildBenefit({ query })).data,
  interestBenefit: async (query) => (await getInterestBenefit({ query })).data,
  vehicleBenefit: async (query) => (await getVehicleBenefit({ query })).data,
  vehicleDepreciation: async (query) =>
    (await getVehicleDepreciation({ query })).data,
  vehicleTax: async (query) => (await getVehicleTax({ query })).data,
  withholdingTax: async (query) => (await getWithholdingTax({ query })).data,
}

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

  validateInput(
    key: CalculatorKey,
    input: Readonly<Record<string, unknown>>,
  ): string[] {
    return invalidClientQueryFields(calculatorRegistry[key].query, input)
  }

  async calculate<K extends CalculatorKey>(
    key: K,
    input: Readonly<Record<string, unknown>>,
  ): Promise<CalculateResult<K>> {
    const { query, result } = calculatorRegistry[key]
    const parsed = parseClientQuery(key, input)

    if (parsed.rejected) {
      return { rejected: parsed.rejected }
    }

    const data = await endpoints[key](toClientQuery(query, parsed.query))

    return { output: data && fromClientResult(result, data) }
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
