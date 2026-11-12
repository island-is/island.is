import { z } from 'zod'

import { invalidClientQueryFields } from './invalidClientQueryFields'

describe('invalidClientQueryFields', () => {
  it('validates dates as ISO strings', () => {
    const shape = { date: z.string().datetime() }

    expect(invalidClientQueryFields(shape, { date: new Date(0) })).toEqual([])
  })

  it('validates ratios after scaling whole percentages', () => {
    const shape = { ratio: z.number().gte(0).lte(1) }

    expect(invalidClientQueryFields(shape, { ratio: 50 })).toEqual([])
    expect(invalidClientQueryFields(shape, { ratio: 150 })).toEqual(['ratio'])
  })
})
