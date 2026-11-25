import { Inject, Injectable } from '@nestjs/common'

import type { CalculateResult } from '@island.is/clients/rsk/calculators'
import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { toOutputValues } from './calculate/outputFieldValue/outputFieldValue'
import {
  toInvalidValueErrors,
  validateCalculationInput,
} from './calculate/submission/submission'
import type { ReachableCalculatorKey } from './contract/calculatorKey'
import { toCalculatorKey } from './contract/calculatorKey'
import { assertPublishableContract } from './contract/validation/validation'
import { toInputField } from './fields/inputField/inputField'
import { toOutputField } from './fields/outputField/outputField'
import type { CalculateInput } from './models/calculateInput.model'
import type { CalculateResponse } from './models/calculateResponse.model'
import { TaxCalculatorCalculationErrorCode } from './models/enums'
import { TaxCalculator } from './models/taxCalculator.model'

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

  /* Synchronous registry lookup. Validation applies to the requested contract. */
  getCalculator(type: TaxCalculatorType): TaxCalculator {
    const contract = this.getContract(type)

    return {
      type,
      inputFields: contract.inputFields.map(toInputField),
      outputFields: contract.outputFields.map(toOutputField),
    }
  }

  /* Returns a response for validation and calculation failures. Contract
   * violations still throw. */
  async calculate(input: CalculateInput): Promise<CalculateResponse> {
    const { type, values } = input
    const contract = this.getContract(type)

    const validation = validateCalculationInput(contract.inputFields, values)

    if (validation.errors.length > 0) {
      return { calculation: undefined, errors: validation.errors }
    }

    let result: CalculateResult<ReachableCalculatorKey>
    try {
      result = await this.calculatorsClientService.calculate(
        toCalculatorKey(type),
        validation.values,
      )
    } catch (error) {
      /* Log upstream failure without including raw error details, which may
       * echo submitted input values, in the response or the log payload. */
      this.logger.error('RSK tax calculation failed', {
        calculator: type,
        ...(error instanceof Error ? { error: error.message } : {}),
      })

      return failed(
        TaxCalculatorCalculationErrorCode.CALCULATION_FAILED,
        'The calculation could not be completed.',
      )
    }

    if (result.rejected) {
      return {
        calculation: undefined,
        errors: toInvalidValueErrors(contract.inputFields, result.rejected),
      }
    }

    if (!result.output) {
      return failed(
        TaxCalculatorCalculationErrorCode.EMPTY_RESULT,
        'The calculation returned no result.',
      )
    }

    return {
      calculation: {
        type,
        values: toOutputValues(contract.outputFields, result.output),
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
}
