import { Injectable } from '@nestjs/common'
import { CalculatorField } from './models/field.model'
import { TaxCalculatorType } from './models/enums'
import { fieldsByCalculatorType } from './calculators.constants'
import { buildFieldModels } from './utils/fieldModel'

@Injectable()
export class TaxCalculatorsService {
  getFields(calculatorType: TaxCalculatorType): CalculatorField[] {
    return buildFieldModels(fieldsByCalculatorType[calculatorType])
  }
}
