import { z } from 'zod'

import { fromClientResult } from './fromClientResult'

const bracket = z.object({
  nedriMork: z.number().int().optional(),
  stadgreidsluhlutfall: z.number().min(0).max(1).optional(),
})

const shape = {
  manadarlaun: z.number().int().optional(),
  stadgreidsluhlutfall: z.number().min(0).max(1).optional(),
  unboundedRatio: z.number().optional(),
  nullableRatio: z.union([z.number().min(0).max(1), z.null()]).optional(),
  skattthrep: z.union([z.array(bracket), z.null()]).optional(),
}

describe('fromClientResult', () => {
  it('converts 0–1 bounded non-integer fields to whole percent', () => {
    const result = fromClientResult(shape, {
      manadarlaun: 800000,
      stadgreidsluhlutfall: 0.3148,
    })

    expect(result.stadgreidsluhlutfall).toBe(31.48)
    expect(result.manadarlaun).toBe(800000)
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
      skattthrep: [{ nedriMork: 0, stadgreidsluhlutfall: 0.3148 }],
    })

    expect(result.skattthrep).toEqual([
      { nedriMork: 0, stadgreidsluhlutfall: 31.48 },
    ])
  })

  it('passes a null array through', () => {
    expect(fromClientResult(shape, { skattthrep: null }).skattthrep).toBeNull()
  })

  it('passes keys missing from the shape through unchanged', () => {
    expect(fromClientResult(shape, { extra: 0.5 }).extra).toBe(0.5)
  })

  it('does not mutate the result', () => {
    const input = {
      stadgreidsluhlutfall: 0.04,
      skattthrep: [{ stadgreidsluhlutfall: 0.04 }],
    }

    fromClientResult(shape, input)

    expect(input).toEqual({
      stadgreidsluhlutfall: 0.04,
      skattthrep: [{ stadgreidsluhlutfall: 0.04 }],
    })
  })
})
