import { z } from 'zod'

import { fromClientResult } from './fromClientResult'

const bracket = z.object({
  lowerBound: z.number().int().optional(),
  rate: z.number().min(0).max(1).optional(),
})

const shape = {
  amount: z.number().int().optional(),
  rate: z.number().min(0).max(1).optional(),
  unboundedRatio: z.number().optional(),
  nullableRatio: z.union([z.number().min(0).max(1), z.null()]).optional(),
  rows: z.union([z.array(bracket), z.null()]).optional(),
}

describe('fromClientResult', () => {
  it('converts 0–1 bounded non-integer fields to whole percent', () => {
    const result = fromClientResult(shape, {
      amount: 800000,
      rate: 0.3148,
    })

    expect(result.rate).toBe(31.48)
    expect(result.amount).toBe(800000)
  })

  it('leaves unbounded numbers unchanged', () => {
    expect(
      fromClientResult(shape, { unboundedRatio: 0.5 }).unboundedRatio,
    ).toBe(0.5)
  })

  it('unwraps null unions', () => {
    expect(fromClientResult(shape, { nullableRatio: 0.04 }).nullableRatio).toBe(
      4,
    )
    expect(
      fromClientResult(shape, { nullableRatio: null }).nullableRatio,
    ).toBeNull()
  })

  it('converts ratios inside arrays of objects', () => {
    const result = fromClientResult(shape, {
      rows: [{ lowerBound: 0, rate: 0.3148 }],
    })

    expect(result.rows).toEqual([{ lowerBound: 0, rate: 31.48 }])
  })

  it('passes a null array through', () => {
    expect(fromClientResult(shape, { rows: null }).rows).toBeNull()
  })

  it('passes keys missing from the shape through unchanged', () => {
    expect(fromClientResult(shape, { extra: 0.5 }).extra).toBe(0.5)
  })

  it('does not mutate the result', () => {
    const input = {
      rate: 0.04,
      rows: [{ rate: 0.04 }],
    }

    fromClientResult(shape, input)

    expect(input).toEqual({
      rate: 0.04,
      rows: [{ rate: 0.04 }],
    })
  })
})
