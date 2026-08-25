import { Injectable } from '@nestjs/common'
import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { CalculatorField } from './models/field.model'
import { CalculatorResultRow } from './models/resultRow.model'
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

  calculate(
    calculatorType: TaxCalculatorType,
    input: CalculatorInputValue[],
  ): Promise<CalculatorResultRow[]> {
    return calculatorsByType[calculatorType].calculate(
      this.calculatorsService,
      input,
    )
  }
}
