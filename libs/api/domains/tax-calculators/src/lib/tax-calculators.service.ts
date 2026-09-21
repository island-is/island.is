import { Inject, Injectable } from '@nestjs/common'

import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import type { ReachableCalculatorKey } from './mappings/calculatorType'
import { toCalculatorKey } from './mappings/calculatorType'
import {
  toChildBenefitInput,
  toVehicleBenefitInput,
  toVehicleTaxInput,
  toWithholdingTaxInput,
} from './mappings/clientInput'
import { toInputField } from './mappings/inputField'
import { toOutputField } from './mappings/outputField'
import { toOutputValues } from './mappings/outputValue'
import type { CalculateInput } from './models/calculateInput.model'
import type { CalculateResponse } from './models/calculateResponse.model'
import { TaxCalculatorCalculationErrorCode } from './models/enums'
import { TaxCalculator } from './models/taxCalculator.model'
import type { SubmittedValues } from './validation/calculationInput'
import { validateCalculationInput } from './validation/calculationInput'
import { assertPublishableContract } from './validation/contract'

const failed = (
  code: TaxCalculatorCalculationErrorCode,
  message: string,
): CalculateResponse => ({
  calculation: undefined,
  errors: [{ code, message }],
})

@Injectable()
export class TaxCalculatorsService {
  constructor(
    private readonly calculatorsClientService: CalculatorsClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /* Synchronous: `getCalculator` is a registry lookup plus a sort, with no
   * network call behind it. Validation runs per request, scoped to the
   * requested calculator, so publication invariant failures are reported on
   * the queried contract. */
  getCalculator(type: TaxCalculatorType): TaxCalculator {
    const contract = this.getContract(type)

    return {
      type,
      inputFields: contract.inputFields.map(toInputField),
      outputFields: contract.outputFields.map(toOutputField),
    }
  }

  /* Returns a populated wrapper on every path a consumer can cause, so this
   * never resolves to null even though the query is nullable. A contract bug
   * still throws, which is the metadata query's posture and deliberate. */
  async calculate(input: CalculateInput): Promise<CalculateResponse> {
    const { type, values } = input
    const contract = this.getContract(type)

    const validation = validateCalculationInput(contract.inputFields, values)

    if (validation.errors.length > 0) {
      return { calculation: undefined, errors: validation.errors }
    }

    let result
    try {
      result = await this.runCalculation(
        toCalculatorKey(type),
        validation.values,
      )
    } catch (error) {
      /* Logged rather than interpolated: this is a public unauthenticated
       * operation, so upstream detail must not reach the response, and this is
       * the one failure mode that cannot be reproduced locally. */
      this.logger.error('RSK tax calculation failed', {
        calculator: type,
        error,
      })

      return failed(
        TaxCalculatorCalculationErrorCode.CALCULATION_FAILED,
        'The calculation could not be completed.',
      )
    }

    if (!result) {
      return failed(
        TaxCalculatorCalculationErrorCode.EMPTY_RESULT,
        'The calculation returned no result.',
      )
    }

    return {
      calculation: {
        type,
        values: toOutputValues(contract.outputFields, result),
      },
      errors: [],
    }
  }

  private getContract(type: TaxCalculatorType) {
    const calculatorKey = toCalculatorKey(type)
    const contract = this.calculatorsClientService.getCalculator(calculatorKey)

    assertPublishableContract(calculatorKey, contract)

    return contract
  }

  /* Dispatches on the client's own key, never on TaxCalculatorType:
   * `mappings/calculatorType.ts` owns the one name that differs between the
   * two vocabularies, and re-deriving it here is how that one silently fails
   * to match. Four cases rather than six -- the client's other two calculators
   * are unreachable until TaxCalculatorType grows, and the `never` below is
   * what fails the build when it does. */
  private runCalculation(key: ReachableCalculatorKey, values: SubmittedValues) {
    switch (key) {
      case 'childBenefit':
        return this.calculatorsClientService.getChildBenefit(
          toChildBenefitInput(values),
        )
      case 'vehicleTax':
        return this.calculatorsClientService.getVehicleTax(
          toVehicleTaxInput(values),
        )
      case 'vehicleBenefit':
        return this.calculatorsClientService.getVehicleBenefit(
          toVehicleBenefitInput(values),
        )
      case 'withholdingTax':
        return this.calculatorsClientService.getWithholdingTax(
          toWithholdingTaxInput(values),
        )
      default: {
        const unhandled: never = key
        return unhandled
      }
    }
  }
}
