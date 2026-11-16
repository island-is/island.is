import type { ZodRawShape } from 'zod'
import { z } from 'zod'

import { toClientQuery } from './toClientQuery'

export const invalidClientQueryFields = (
  shape: ZodRawShape,
  input: Readonly<Record<string, unknown>>,
): string[] => {
  const query = Object.fromEntries(
    Object.entries(toClientQuery(shape, input)).map(([key, value]) => [
      key,
      value instanceof Date ? value.toISOString() : value,
    ]),
  )
  const result = z.object(shape).safeParse(query)

  return result.success
    ? []
    : [...new Set(result.error.issues.map((issue) => String(issue.path[0])))]
}
