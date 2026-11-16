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
} from '../types/calculators'
import { byName } from '../utils/byName'
import type { CalculatorKey } from './calculators.registry'
import { calculatorRegistry } from './calculators.registry'
import { fromClientResult } from './fromClientResult'
import { parseClientQuery } from './parseClientQuery'
import { toClientQuery } from './toClientQuery'

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
}
