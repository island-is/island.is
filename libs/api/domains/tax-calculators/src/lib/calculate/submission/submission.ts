import { isMatch } from 'date-fns'

import type {
  CalculatorField,
  CalculatorFieldSemantic,
} from '@island.is/clients/rsk/calculators'

import { TaxCalculatorCalculationErrorCode } from '../../models/enums'
import type { CalculationError } from '../../models/calculationError.model'
import type { InputFieldValue } from '../../models/inputFieldValue.model'
import type { InputValue } from '../../models/inputValue.model'
import { NUMERIC_SEMANTIC_RANGE } from '../../shared/numericSemanticRange'

export type SubmittedValue = string | number | boolean
export type SubmittedValues = Record<string, SubmittedValue>

export interface CalculationInputValidation {
  /* Applicable submitted values. Valid only when `errors` is empty. */
  values: SubmittedValues
  errors: CalculationError[]
}

/* Validation uses the source contract, which retains semantic and option data
 * without narrowing a GraphQL union. The contract is already publishable. */

const INTEGER_SEMANTICS: readonly CalculatorFieldSemantic[] = [
  'year',
  'month',
  'count',
]

/* Only the empty string is absent; other strings are validated. */
const toSubmittedValue = (value: InputValue): SubmittedValue | undefined => {
  if (typeof value.numberValue === 'number') {
    return value.numberValue
  }

  if (typeof value.booleanValue === 'boolean') {
    return value.booleanValue
  }

  if (typeof value.stringValue === 'string') {
    return value.stringValue === '' ? undefined : value.stringValue
  }

  return undefined
}

/* isMatch validates calendar values but accepts an unpadded month or day. */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const isCalendarDate = (value: string): boolean =>
  DATE_PATTERN.test(value) && isMatch(value, 'yyyy-MM-dd')

const describeKind = (value: SubmittedValue): string =>
  typeof value === 'number'
    ? 'a number'
    : typeof value === 'boolean'
    ? 'a boolean'
    : 'a string'

const describeProblem = (
  field: CalculatorField,
  value: SubmittedValue,
): string | undefined => {
  switch (field.type) {
    case 'number': {
      if (typeof value !== 'number') {
        return `expects a number, received ${describeKind(value)}`
      }

      if (!Number.isFinite(value)) {
        return 'expects a finite number'
      }

      /* Year, month, and count values are integers. */
      if (
        field.semantic &&
        INTEGER_SEMANTICS.includes(field.semantic) &&
        !Number.isInteger(value)
      ) {
        return `expects a whole number, since it carries the ${field.semantic} semantic`
      }

      const range = field.semantic && NUMERIC_SEMANTIC_RANGE[field.semantic]

      if (range) {
        const { min, max } = range

        if (
          min !== undefined &&
          max !== undefined &&
          (value < min || value > max)
        ) {
          return `expects a ${field.semantic} between ${min} and ${max}`
        }

        if (max === undefined && min !== undefined && value < min) {
          return `expects a ${field.semantic} of ${min} or more`
        }
      }

      return undefined
    }
    case 'boolean':
      return typeof value === 'boolean'
        ? undefined
        : `expects a boolean, received ${describeKind(value)}`
    case 'string':
      return typeof value === 'string'
        ? undefined
        : `expects a string, received ${describeKind(value)}`
    case 'date': {
      if (typeof value !== 'string') {
        return `expects a string, received ${describeKind(value)}`
      }

      return isCalendarDate(value)
        ? undefined
        : `expects a calendar date formatted yyyy-MM-dd, received "${value}"`
    }
    case 'select': {
      if (typeof value !== 'string') {
        return `expects a string, received ${describeKind(value)}`
      }

      const permitted = (field.options ?? []).map((option) => option.value)

      return permitted.includes(value)
        ? undefined
        : `expects one of ${permitted.join(', ')}, received "${value}"`
    }
    default: {
      const unhandled: never = field.type
      return unhandled
    }
  }
}

export const validateCalculationInput = (
  inputFields: readonly CalculatorField[],
  submitted: readonly InputFieldValue[],
): CalculationInputValidation => {
  const fieldNames = new Set(inputFields.map((field) => field.name))
  const values: SubmittedValues = {}
  const errors: CalculationError[] = []
  const seen = new Set<string>()
  const duplicated = new Set<string>()

  for (const row of submitted) {
    if (seen.has(row.key)) {
      /* Report each duplicate key once. */
      if (!duplicated.has(row.key)) {
        duplicated.add(row.key)
        errors.push({
          code: TaxCalculatorCalculationErrorCode.DUPLICATE_FIELD,
          key: row.key,
          message: `Field "${row.key}" was submitted more than once.`,
        })
      }
      continue
    }

    seen.add(row.key)

    if (!fieldNames.has(row.key)) {
      errors.push({
        code: TaxCalculatorCalculationErrorCode.UNKNOWN_FIELD,
        key: row.key,
        message: `Field "${row.key}" is not part of this calculator's input contract.`,
      })
      continue
    }

    const value = toSubmittedValue(row.value)

    if (value !== undefined) {
      values[row.key] = value
    }
  }

  /* Single level, which is complete rather than merely sufficient:
   * assertPublishableContract rejects a dependency whose target is itself
   * conditional, so a chain cannot reach this. */
  const isApplicable = (field: CalculatorField): boolean =>
    !field.dependsOn || values[field.dependsOn.field] === field.dependsOn.equals

  /* Iterating contract fields preserves deterministic error order. */
  for (const field of inputFields) {
    const value = values[field.name]
    const applicable = isApplicable(field)

    if (value === undefined) {
      if (field.required && applicable) {
        errors.push({
          code: TaxCalculatorCalculationErrorCode.MISSING_REQUIRED_VALUE,
          key: field.name,
          message: `Field "${field.name}" is required.`,
        })
      }
      continue
    }

    if (field.dependsOn && !applicable) {
      delete values[field.name]
      errors.push({
        code: TaxCalculatorCalculationErrorCode.INAPPLICABLE_VALUE,
        key: field.name,
        message: `Field "${field.name}" does not apply unless "${
          field.dependsOn.field
        }" equals ${JSON.stringify(field.dependsOn.equals)}.`,
      })
      continue
    }

    const problem = describeProblem(field, value)

    if (problem) {
      errors.push({
        code: TaxCalculatorCalculationErrorCode.INVALID_VALUE,
        key: field.name,
        message: `Field "${field.name}" ${problem}.`,
      })
    }
  }

  return { values, errors }
}
