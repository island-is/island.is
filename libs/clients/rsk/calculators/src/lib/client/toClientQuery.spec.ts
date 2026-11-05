import { z } from 'zod'

import { toClientQuery } from './toClientQuery'

const shape = {
  laun: z.number().int(),
  launamanudur: z.number().int(),
  lifeyrissjodurHlutfall: z.number().min(0).max(1),
  nytingSkattkorts: z.number().min(0).max(1).optional(),
  motframlagLifeyrissjodur: z.number().min(0).max(1),
  hjuskaparstada: z.string(),
  gjaldskipting: z.date(),
}

describe('toClientQuery', () => {
  it('passes non-ratio values through unchanged', () => {
    const input = {
      hjuskaparstada: 'Gift/Í sambúð',
      laun: 800000,
      launamanudur: 1,
    }

    expect(toClientQuery(shape, input)).toEqual(input)
  })

  it('divides 0–1 bounded non-integer parameters by 100', () => {
    const query = toClientQuery(shape, {
      laun: 800000,
      lifeyrissjodurHlutfall: 4,
      nytingSkattkorts: 100,
      motframlagLifeyrissjodur: 11.5,
    })

    expect(query.lifeyrissjodurHlutfall).toBe(0.04)
    expect(query.nytingSkattkorts).toBe(1)
    expect(query.motframlagLifeyrissjodur).toBeCloseTo(0.115)
    expect(query.laun).toBe(800000)
  })

  it('passes dates through unchanged', () => {
    const gjaldskipting = new Date('2026-03-01')

    expect(toClientQuery(shape, { gjaldskipting }).gjaldskipting).toBe(
      gjaldskipting,
    )
  })
})
