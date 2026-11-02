import type { ZodRawShape, ZodTypeAny } from 'zod'
import { ZodArray, ZodObject } from 'zod'

import { isRskRatio, unwrap } from './isRskRatio'
import { rskRatioToPercent } from './rskRatioToPercent'

const fromClientValue = (schema: ZodTypeAny, value: unknown): unknown => {
  const inner = unwrap(schema)
  if (typeof value === 'number' && isRskRatio(inner)) {
    return rskRatioToPercent(value)
  }
  if (Array.isArray(value) && inner instanceof ZodArray) {
    return value.map((item) => fromClientValue(inner.element, item))
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    inner instanceof ZodObject
  ) {
    return fromClientResult(inner.shape, value)
  }
  return value
}

export const fromClientResult = <TResult extends object>(
  shape: ZodRawShape,
  result: TResult,
): TResult =>
  Object.assign(
    { ...result },
    Object.fromEntries(
      Object.entries(result).flatMap(([key, value]): [string, unknown][] => {
        const schema = shape[key]
        return schema ? [[key, fromClientValue(schema, value)]] : []
      }),
    ),
  )
