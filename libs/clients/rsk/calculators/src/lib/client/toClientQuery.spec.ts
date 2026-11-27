import { z } from 'zod'

import { toClientQuery } from './toClientQuery'

const shape = {
  amount: z.number().int(),
  ratio: z.number().min(0).max(1),
  optionalRatio: z.number().min(0).max(1).optional(),
  fractionalRatio: z.number().min(0).max(1),
}

describe('toClientQuery', () => {
  it('divides 0–1 bounded non-integer parameters by 100', () => {
    const query = toClientQuery(shape, {
      amount: 800000,
      ratio: 4,
      optionalRatio: 100,
      fractionalRatio: 11.5,
    })

    expect(query.ratio).toBe(0.04)
    expect(query.optionalRatio).toBe(1)
    expect(query.fractionalRatio).toBeCloseTo(0.115)
    expect(query.amount).toBe(800000)
  })
})
