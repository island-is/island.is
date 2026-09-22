import { Inject, Injectable } from '@nestjs/common'

import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import type { ReachableCalculatorKey } from './contract/calculatorKey'
import { toCalculatorKey } from './contract/calculatorKey'
import { assertPublishableContract } from './contract/validation/validation'
import { toChildBenefitInput } from './calculate/clientInput/childBenefit/childBenefit'
import { toVehicleBenefitInput } from './calculate/clientInput/vehicleBenefit/vehicleBenefit'
import { toVehicleTaxInput } from './calculate/clientInput/vehicleTax/vehicleTax'
import { toWithholdingTaxInput } from './calculate/clientInput/withholdingTax/withholdingTax'
import { toOutputValues } from './calculate/outputFieldValue/outputFieldValue'
import type { SubmittedValues } from './calculate/submission/submission'
import { validateCalculationInput } from './calculate/submission/submission'
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

    let result
    try {
      result = await this.runCalculation(
        toCalculatorKey(type),
        validation.values,
      )
    } catch (error) {
      /* Log upstream details without including them in the response. */
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

  /* Dispatches after the single calculator-type-to-key mapping. `never` makes
   * new reachable calculator keys a compile-time failure. */
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
