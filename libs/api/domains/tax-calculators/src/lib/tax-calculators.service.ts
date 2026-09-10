import { Injectable } from '@nestjs/common'

import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { toCalculatorKey } from './mappings/calculatorType'
import { toInputField } from './mappings/inputField'
import { TaxCalculator } from './models/taxCalculator.model'
import { assertPublishableContract } from './validation/inputContract'

@Injectable()
export class TaxCalculatorsService {
  constructor(
    private readonly calculatorsClientService: CalculatorsClientService,
  ) {}

  /* Synchronous: `getCalculator` is a registry lookup plus a sort, with no
   * network call behind it. Validation runs per request, scoped to the
   * requested calculator -- see PLAN.md for why this is not hoisted to a
   * module-init check. */
  getCalculator(type: TaxCalculatorType): TaxCalculator {
    const calculatorKey = toCalculatorKey(type)
    const contract = this.calculatorsClientService.getCalculator(calculatorKey)

    assertPublishableContract(calculatorKey, contract)

    return {
      type,
      inputFields: contract.inputFields.map(toInputField),
    }
  }
}
