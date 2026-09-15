import type {
  CalculatorField,
  CalculatorFieldDependency,
  CalculatorFieldSemantic,
  CalculatorFieldType,
} from '@island.is/clients/rsk/calculators'

import { BooleanInputDependencyValue } from '../models/booleanInputDependencyValue.model'
import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '../models/enums'
import type { InputDependencyValueUnion } from '../models/inputDependencyValue.model'
import type {
  BooleanInputField,
  DateInputField,
  InputField,
  NumberInputField,
  SelectInputField,
  StringInputField,
} from '../models/inputField.model'
import { InputFieldDependency } from '../models/inputFieldDependency.model'
import { NumberInputDependencyValue } from '../models/numberInputDependencyValue.model'
import { StringInputDependencyValue } from '../models/stringInputDependencyValue.model'

/* Both Records are keyed on the client's own literal unions, so a type or
 * semantic added to @island.is/clients/rsk/calculators fails to compile here
 * -- this is the module that notices a client contract change, not the
 * interface's resolveType, which only ever sees the domain enum. */
const INPUT_FIELD_TYPE_BY_CLIENT_TYPE: Record<
  CalculatorFieldType,
  TaxCalculatorInputFieldType
> = {
  number: TaxCalculatorInputFieldType.NUMBER,
  string: TaxCalculatorInputFieldType.STRING,
  boolean: TaxCalculatorInputFieldType.BOOLEAN,
  date: TaxCalculatorInputFieldType.DATE,
  select: TaxCalculatorInputFieldType.SELECT,
}

const SEMANTIC_BY_CLIENT_SEMANTIC: Record<
  CalculatorFieldSemantic,
  TaxCalculatorInputFieldSemantic
> = {
  currency: TaxCalculatorInputFieldSemantic.CURRENCY,
  percentage: TaxCalculatorInputFieldSemantic.PERCENTAGE,
  year: TaxCalculatorInputFieldSemantic.YEAR,
  month: TaxCalculatorInputFieldSemantic.MONTH,
  count: TaxCalculatorInputFieldSemantic.COUNT,
}

export const toDependencyValue = (
  equals: CalculatorFieldDependency['equals'],
): InputDependencyValueUnion => {
  switch (typeof equals) {
    case 'boolean': {
      const value: BooleanInputDependencyValue = { value: equals }
      return value
    }
    case 'string': {
      const value: StringInputDependencyValue = { value: equals }
      return value
    }
    default: {
      const value: NumberInputDependencyValue = { value: equals }
      return value
    }
  }
}

export const toDependency = (
  dependsOn: CalculatorFieldDependency,
): InputFieldDependency => ({
  fieldKey: dependsOn.field,
  equals: toDependencyValue(dependsOn.equals),
})

/* Plain objects rather than `new`-ed instances: both resolveType functions in
 * this module are data-driven (the interface switches on `type`, the union on
 * `typeof value.value`), so nothing needs an instanceof check. */
export const toInputField = (field: CalculatorField): InputField => {
  const shared = {
    key: field.name,
    required: field.required,
    dependsOn: field.dependsOn ? toDependency(field.dependsOn) : undefined,
  }

  switch (field.type) {
    case 'number': {
      const inputField: NumberInputField = {
        ...shared,
        type: INPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
        semantic: field.semantic
          ? SEMANTIC_BY_CLIENT_SEMANTIC[field.semantic]
          : undefined,
      }
      return inputField
    }
    case 'select': {
      const inputField: SelectInputField = {
        ...shared,
        type: INPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
        options: (field.options ?? []).map((option) => ({
          value: option.value,
        })),
      }
      return inputField
    }
    case 'string': {
      const inputField: StringInputField = {
        ...shared,
        type: INPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
      }
      return inputField
    }
    case 'boolean': {
      const inputField: BooleanInputField = {
        ...shared,
        type: INPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
      }
      return inputField
    }
    case 'date': {
      const inputField: DateInputField = {
        ...shared,
        type: INPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type],
      }
      return inputField
    }
    default: {
      const unhandled: never = field.type
      return unhandled
    }
  }
}
