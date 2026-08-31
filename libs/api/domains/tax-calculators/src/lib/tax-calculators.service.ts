import { Injectable } from '@nestjs/common'
import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { CalculatorField } from './models/field.model'
import { CalculatorCalculationResult } from './models/calculationResult.model'
import { CalculatorInputValue } from './dto/inputValue.input'
import { TaxCalculatorType } from './models/enums'
import { calculatorsByType } from './calculators.constants'
import { buildFieldModels } from './utils/fieldModel'

@Injectable()
export class TaxCalculatorsService {
  constructor(private readonly calculatorsService: CalculatorsClientService) {}

  getFields(calculatorType: TaxCalculatorType): CalculatorField[] {
    return buildFieldModels(calculatorsByType[calculatorType].fields)
  }

  async calculate(
    calculatorType: TaxCalculatorType,
    input: CalculatorInputValue[],
  ): Promise<CalculatorCalculationResult> {
    const values = await calculatorsByType[calculatorType].calculate(
      this.calculatorsService,
      input,
    )
    const result = new CalculatorCalculationResult()
    result.values = values
    return result
  }
}
