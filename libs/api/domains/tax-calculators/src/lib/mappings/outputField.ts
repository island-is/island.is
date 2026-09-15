import type {
  CalculatorFieldSemantic,
  CalculatorOutputField,
  CalculatorOutputScalarType,
  CalculatorScalarOutputField,
} from '@island.is/clients/rsk/calculators'

import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '../models/enums'
import type {
  ArrayOutputField,
  BooleanOutputField,
  DateOutputField,
  NumberOutputField,
  OutputField,
  OutputScalarField,
  ScalarOutputFieldType,
  StringOutputField,
} from '../models/outputField.model'

const OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE: Record<
  CalculatorOutputScalarType,
  ScalarOutputFieldType
> = {
  number: TaxCalculatorOutputFieldType.NUMBER,
  string: TaxCalculatorOutputFieldType.STRING,
  boolean: TaxCalculatorOutputFieldType.BOOLEAN,
  date: TaxCalculatorOutputFieldType.DATE,
}

const SEMANTIC_BY_CLIENT_SEMANTIC: Record<
  CalculatorFieldSemantic,
  TaxCalculatorOutputFieldSemantic
> = {
  currency: TaxCalculatorOutputFieldSemantic.CURRENCY,
  percentage: TaxCalculatorOutputFieldSemantic.PERCENTAGE,
  year: TaxCalculatorOutputFieldSemantic.YEAR,
  month: TaxCalculatorOutputFieldSemantic.MONTH,
  count: TaxCalculatorOutputFieldSemantic.COUNT,
}

export const toOutputScalarField = (
  field: CalculatorScalarOutputField,
): OutputScalarField => {
  const shared = { key: field.name }

  switch (field.type) {
    case 'number': {
      const outputField: NumberOutputField = {
        ...shared,
        type: OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
        semantic: field.semantic
          ? SEMANTIC_BY_CLIENT_SEMANTIC[field.semantic]
          : undefined,
      }
      return outputField
    }
    case 'string': {
      const outputField: StringOutputField = {
        ...shared,
        type: OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
      }
      return outputField
    }
    case 'boolean': {
      const outputField: BooleanOutputField = {
        ...shared,
        type: OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
      }
      return outputField
    }
    case 'date': {
      const outputField: DateOutputField = {
        ...shared,
        type: OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
      }
      return outputField
    }
    default: {
      const unhandled: never = field.type
      return unhandled
    }
  }
}

export const toOutputField = (field: CalculatorOutputField): OutputField => {
  switch (field.kind) {
    case 'scalar':
      return toOutputScalarField(field)
    case 'array': {
      const outputField: ArrayOutputField = {
        key: field.name,
        type: TaxCalculatorOutputFieldType.ARRAY,
        itemFields: field.itemFields.map(toOutputScalarField),
      }
      return outputField
    }
    default: {
      const unhandled: never = field
      return unhandled
    }
  }
}
