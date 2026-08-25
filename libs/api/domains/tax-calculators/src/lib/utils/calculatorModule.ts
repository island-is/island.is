import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { CalculatorInputValue } from '../dto/inputValue.input'
import { CalculatorResultRow } from '../models/resultRow.model'
import { FieldDefinition } from './parsing'

export interface CalculatorModule {
  fields: FieldDefinition[]
  calculate: (
    client: CalculatorsClientService,
    input: CalculatorInputValue[],
  ) => Promise<CalculatorResultRow[]>
}
