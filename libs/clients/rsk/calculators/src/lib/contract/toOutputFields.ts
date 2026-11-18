import type { ZodRawShape, ZodTypeAny } from 'zod'
import {
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodEnum,
  ZodNumber,
  ZodObject,
  ZodString,
} from 'zod'

import type {
  CalculatorOutputField,
  CalculatorScalarOutputField,
} from '../types/output-field'
import { unwrap } from '../utils/isRskRatio'
import { numberSemantic } from './numberSemantic'

const toScalarField = (
  name: string,
  inner: ZodTypeAny,
): CalculatorScalarOutputField | undefined => {
  if (inner instanceof ZodNumber || inner instanceof ZodBigInt) {
    return {
      name,
      kind: 'scalar',
      type: 'number',
      semantic: numberSemantic(inner),
    }
  }
  if (inner instanceof ZodBoolean) {
    return { name, kind: 'scalar', type: 'boolean' }
  }
  if (inner instanceof ZodString) {
    return {
      name,
      kind: 'scalar',
      type: inner.isDatetime ? 'date' : 'string',
    }
  }
  if (inner instanceof ZodEnum) {
    return { name, kind: 'scalar', type: 'string' }
  }
  return undefined
}

const toScalarFields = (shape: ZodRawShape): CalculatorScalarOutputField[] =>
  Object.entries(shape).flatMap(([name, schema]) => {
    const field = toScalarField(name, unwrap(schema))
    return field ? [field] : []
  })

const toOutputField = (
  name: string,
  schema: ZodTypeAny,
): CalculatorOutputField | undefined => {
  const inner = unwrap(schema)

  if (inner instanceof ZodArray) {
    const element = unwrap(inner.element)
    return element instanceof ZodObject
      ? { name, kind: 'array', itemFields: toScalarFields(element.shape) }
      : undefined
  }
  if (inner instanceof ZodObject) {
    return { name, kind: 'object', itemFields: toScalarFields(inner.shape) }
  }
  return toScalarField(name, inner)
}

export const toOutputFields = (shape: ZodRawShape): CalculatorOutputField[] =>
  Object.entries(shape).flatMap(([name, schema]) => {
    const field = toOutputField(name, schema)
    return field ? [field] : []
  })
