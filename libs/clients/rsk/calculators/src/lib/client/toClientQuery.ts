import type { ZodRawShape } from 'zod'

import { isRskRatio } from '../utils/isRskRatio'
import { percentToRskRatio } from '../utils/percentToRskRatio'

/* Maps client input to the generated client's query. Today that only scales
 * whole percentages (0-100) to the 0-1 ratios RSK expects, detected from the
 * generated zod schema so endpoints need no hand mapping. */
export const toClientQuery = <TQuery extends object>(
  shape: ZodRawShape,
  input: TQuery,
): TQuery =>
  Object.assign(
    { ...input },
    Object.fromEntries(
      Object.entries(input).flatMap(([key, value]): [string, unknown][] => {
        const schema = shape[key]
        return schema && typeof value === 'number' && isRskRatio(schema)
          ? [[key, percentToRskRatio(value)]]
          : []
      }),
    ),
  )
