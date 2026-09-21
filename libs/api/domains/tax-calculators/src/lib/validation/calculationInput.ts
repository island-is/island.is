import { isValid, parse } from 'date-fns'

import type {
  CalculatorField,
  CalculatorFieldSemantic,
} from '@island.is/clients/rsk/calculators'

import { TaxCalculatorCalculationErrorCode } from '../models/enums'
import type { CalculationError } from '../models/calculationError.model'
import type { InputFieldValue } from '../models/inputFieldValue.model'
import type { InputValue } from '../models/inputValue.model'

export type SubmittedValue = string | number | boolean
export type SubmittedValues = Record<string, SubmittedValue>

export interface CalculationInputValidation {
  /* Only applicable fields that carry a value, ready to hand to a client input
   * builder. Meaningless unless `errors` is empty. */
  values: SubmittedValues
  errors: CalculationError[]
}

/* Validation runs against the client contract rather than the mapped domain
 * models. The two carry the same data -- `CalculatorField.name` is the public
 * `key`, one to one -- but the client's is a flat interface, so `semantic` and
 * `options` are reachable without narrowing an interface hierarchy the
 * published models only discriminate through __typename. The contract is
 * asserted publishable before this runs, so every dependency target exists. */

const INTEGER_SEMANTICS: readonly CalculatorFieldSemantic[] = [
  'year',
  'month',
  'count',
]

/* Deliberately strict: only the empty string is absent, not whitespace. A
 * value the consumer took the trouble to send is reported as invalid rather
 * than silently dropped, and a blank control is expected to omit its row. */
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

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/* The pattern alone would accept 2026-02-31, and parsing alone would accept
 * 2026-2-3. Both have to hold. */
const isCalendarDate = (value: string): boolean =>
  DATE_PATTERN.test(value) && isValid(parse(value, 'yyyy-MM-dd', new Date()))

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

      /* The one place a semantic affects behaviour rather than presentation.
       * An integrality rule is not the range assertion the semantic enum
       * disclaims -- `numberOfChildren: 2.5` is malformed, not out of range --
       * and the alternative is letting RSK decide what a fractional child is. */
      if (
        field.semantic &&
        INTEGER_SEMANTICS.includes(field.semantic) &&
        !Number.isInteger(value)
      ) {
        return `expects a whole number, since it carries the ${field.semantic} semantic`
      }

      /* Zero stays valid: two children and none under seven is an ordinary
       * childBenefit submission. */
      if (field.semantic === 'count' && value < 0) {
        return 'expects a count of zero or more'
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
      /* Reported once per key however many times it repeats -- a consumer
       * fixes the duplicate, not each recurrence. */
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

  /* Iterating the contract rather than the submission keeps error order
   * deterministic regardless of how the consumer ordered its values. */
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
