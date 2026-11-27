import type { ZodRawShape, ZodTypeAny } from 'zod'
import {
  ZodBoolean,
  ZodDefault,
  ZodEnum,
  ZodNullable,
  ZodNumber,
  ZodOptional,
  ZodString,
} from 'zod'

import type { CalculatorField } from '../types/input-field'
import { isRskRatio, unwrap } from '../utils/isRskRatio'
import { rskRatioToPercent } from '../utils/rskRatioToPercent'
import { numberSemantic } from './numberSemantic'

const findDefault = (schema: ZodTypeAny): unknown => {
  if (schema instanceof ZodDefault) {
    return schema._def.defaultValue()
  }
  if (schema instanceof ZodOptional || schema instanceof ZodNullable) {
    return findDefault(schema._def.innerType)
  }
  return undefined
}

const toNumberField = (
  name: string,
  required: boolean,
  schema: ZodTypeAny,
  inner: ZodNumber,
): CalculatorField => {
  const isRatio = isRskRatio(inner)
  const scale = (value: number | null) =>
    value === null ? undefined : isRatio ? rskRatioToPercent(value) : value
  const defaultValue = findDefault(schema)

  return {
    name,
    type: 'number',
    required,
    semantic: numberSemantic(inner),
    integer: inner.isInt,
    minimum: scale(inner.minValue),
    maximum: scale(inner.maxValue),
    defaultValue:
      typeof defaultValue === 'number' ? scale(defaultValue) : undefined,
  }
}

const toInputField = (
  name: string,
  schema: ZodTypeAny,
): CalculatorField | undefined => {
  const required = !(schema instanceof ZodOptional)
  const inner = unwrap(schema)

  if (inner instanceof ZodNumber) {
    return toNumberField(name, required, schema, inner)
  }
  if (inner instanceof ZodEnum) {
    return {
      name,
      type: 'select',
      required,
      options: inner.options.map((value: string) => ({ value })),
    }
  }
  if (inner instanceof ZodBoolean) {
    return { name, type: 'boolean', required }
  }
  if (inner instanceof ZodString) {
    return { name, type: inner.isDatetime ? 'date' : 'string', required }
  }
  return undefined
}

export const toInputFields = (shape: ZodRawShape): CalculatorField[] =>
  Object.entries(shape).flatMap(([name, schema]) => {
    const field = toInputField(name, schema)
    return field ? [field] : []
  })
