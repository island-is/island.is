import { BadRequestException } from '@nestjs/common'
import { TaxCalculatorFieldKind } from '../models/enums'
import { CalculatorInputValue } from '../dto/inputValue.input'

export interface FieldDefinition {
  key: string
  rawKey: string
  label: string
  kind: TaxCalculatorFieldKind
  required: boolean
  unit?: string
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  parse: (raw: string, key: string) => number | boolean | string | Date
}

export const parseNumber = (raw: string, key: string): number => {
  const value = Number(raw)
  if (Number.isNaN(value)) {
    throw new BadRequestException(`Invalid number value for field "${key}"`)
  }
  return value
}

export const parseBoolean = (raw: string, key: string): boolean => {
  if (raw === 'true') return true
  if (raw === 'false') return false
  throw new BadRequestException(`Invalid boolean value for field "${key}"`)
}

export const parseString = (raw: string): string => raw

export const parseDate = (raw: string, key: string): Date => {
  const value = new Date(raw)
  if (Number.isNaN(value.getTime())) {
    throw new BadRequestException(`Invalid date value for field "${key}"`)
  }
  return value
}

/**
 * The raw API expects several fields as a ratio between 0 and 1. We expose
 * these to the web client as a 0-100 percentage for better UX and convert
 * back to a ratio here.
 */
export const parsePercentageToRatio = (raw: string, key: string): number =>
  parseNumber(raw, key) / 100

// 32-bit signed int max. A generic overflow guard for NUMBER fields with no
// real business-defined upper bound -- not a business rule itself.
export const MAX_SANE_NUMBER_VALUE = 2_147_483_647

/**
 * Builds the raw client query object from the generic key/value pairs
 * submitted by the web client, validating required fields and parsing
 * string values into the types the underlying client expects.
 */
export const buildCalculatorQuery = <TQuery>(
  fields: FieldDefinition[],
  input: CalculatorInputValue[],
): TQuery => {
  const valuesByKey = new Map(input.map((entry) => [entry.key, entry.value]))
  const query: Record<string, number | boolean | string | Date> = {}

  for (const definition of fields) {
    const raw = valuesByKey.get(definition.key)
    // The web client always submits every field, so an optional field left
    // blank arrives as "" rather than being omitted -- treat both as "not
    // provided" rather than parsing an empty string.
    if (raw === undefined || raw === '') {
      if (definition.required) {
        throw new BadRequestException(
          `Missing required field "${definition.key}"`,
        )
      }
      continue
    }
    query[definition.rawKey] = definition.parse(raw, definition.key)
  }

  return query as TQuery
}
