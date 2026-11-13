import type { ZodRawShape, ZodTypeAny } from 'zod'
import { z, ZodString } from 'zod'

import { unwrap } from '../utils/isRskRatio'
import { toClientQuery } from './toClientQuery'

const isDatetime = (schema: ZodTypeAny | undefined): boolean => {
  if (!schema) {
    return false
  }
  const inner = unwrap(schema)
  return inner instanceof ZodString && inner.isDatetime
}

const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

export const invalidClientQueryFields = (
  shape: ZodRawShape,
  input: Readonly<Record<string, unknown>>,
): string[] => {
  const known = new Set(Object.keys(shape))
  const unknownKeys = Object.keys(input).filter((key) => !known.has(key))
  const notDates = Object.entries(input).flatMap(([key, value]) =>
    value != null && isDatetime(shape[key]) && !isValidDate(value) ? [key] : [],
  )
  const query = Object.fromEntries(
    Object.entries(toClientQuery(shape, input)).map(([key, value]) => [
      key,
      isDatetime(shape[key]) && isValidDate(value)
        ? value.toISOString()
        : value,
    ]),
  )
  const result = z.object(shape).safeParse(query)
  const failing = result.success
    ? []
    : result.error.issues.map((issue) => String(issue.path[0]))

  return [...new Set([...unknownKeys, ...notDates, ...failing])]
}
