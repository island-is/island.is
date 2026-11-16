import type { ZodRawShape, ZodTypeAny } from 'zod'
import { z, ZodString } from 'zod'

import { unwrap } from '../utils/isRskRatio'

type Query = Readonly<Record<string, unknown>>

const isDatetime = (schema: ZodTypeAny | undefined): boolean => {
  if (!schema) {
    return false
  }
  const inner = unwrap(schema)
  return inner instanceof ZodString && inner.isDatetime
}

const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

const unknownFields = (shape: ZodRawShape, query: Query): string[] => {
  const known = new Set(Object.keys(shape))
  return Object.keys(query).filter((key) => !known.has(key))
}

const nonDateFields = (shape: ZodRawShape, query: Query): string[] =>
  Object.entries(query).flatMap(([key, value]) =>
    value != null && isDatetime(shape[key]) && !isValidDate(value) ? [key] : [],
  )

const serializeDates = (shape: ZodRawShape, query: Query): Query =>
  Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      isDatetime(shape[key]) && isValidDate(value)
        ? value.toISOString()
        : value,
    ]),
  )

const schemaFailures = (shape: ZodRawShape, query: Query): string[] => {
  const result = z.object(shape).safeParse(query)
  return result.success
    ? []
    : result.error.issues.map((issue) => String(issue.path[0]))
}

export const validateClientQuery = (
  shape: ZodRawShape,
  query: Query,
): string[] => [
  ...new Set([
    ...unknownFields(shape, query),
    ...nonDateFields(shape, query),
    ...schemaFailures(shape, serializeDates(shape, query)),
  ]),
]
