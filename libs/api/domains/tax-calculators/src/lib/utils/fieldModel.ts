import { CalculatorField } from '../models/field.model'
import { FieldDefinition } from './fieldDefinition'

export const buildFieldModels = (
  definitions: FieldDefinition[],
): CalculatorField[] =>
  definitions.map((definition) => {
    const field = new CalculatorField()
    field.key = definition.key
    field.label = definition.label
    field.kind = definition.kind
    field.required = definition.required
    field.unit = definition.unit
    field.min = definition.min
    field.max = definition.max
    field.options = definition.options
    return field
  })
