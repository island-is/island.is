import type { ZodRawShape, ZodTypeAny } from 'zod'
import { ZodDefault, ZodNumber, ZodOptional } from 'zod'

import { percentToRskRatio } from './percentToRskRatio'

const unwrap = (schema: ZodTypeAny): ZodTypeAny =>
  schema instanceof ZodOptional || schema instanceof ZodDefault
    ? unwrap(schema._def.innerType)
    : schema

const isRatio = (schema: ZodTypeAny) => {
  const inner = unwrap(schema)
  return (
    inner instanceof ZodNumber &&
    !inner.isInt &&
    inner.minValue === 0 &&
    inner.maxValue === 1
  )
}

export const toSpecQuery = <TQuery extends object>(
  shape: ZodRawShape,
  input: TQuery,
): TQuery =>
  Object.assign(
    { ...input },
    Object.fromEntries(
      Object.entries(input).flatMap(([key, value]): [string, unknown][] => {
        const schema = shape[key]
        return schema && typeof value === 'number' && isRatio(schema)
          ? [[key, percentToRskRatio(value)]]
          : []
      }),
    ),
  )
