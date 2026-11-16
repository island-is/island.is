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

  it('rejects a date-time value that is not a Date', () => {
    const shape = { date: z.string().datetime() }

    expect(
      invalidClientQueryFields(shape, { date: '1970-01-01T00:00:00.000Z' }),
    ).toEqual(['date'])
  })

  it('accepts an absent optional date-time', () => {
    const shape = { date: z.string().datetime().optional() }

    expect(invalidClientQueryFields(shape, {})).toEqual([])
  })

  it('rejects an unknown key', () => {
    const shape = { count: z.number() }

    expect(invalidClientQueryFields(shape, { count: 1, foo: 1 })).toEqual([
      'foo',
    ])
  })

  it('rejects an invalid Date', () => {
    const shape = { date: z.string().datetime() }

    expect(
      invalidClientQueryFields(shape, { date: new Date('garbage') }),
    ).toEqual(['date'])
  })

  it('rejects a Date for a plain string field', () => {
    const shape = { text: z.string() }

    expect(invalidClientQueryFields(shape, { text: new Date() })).toEqual([
      'text',
    ])
  })

  it('rejects a prototype key as an unknown key', () => {
    const shape = { count: z.number() }

    expect(
      invalidClientQueryFields(shape, { count: 1, constructor: 1 }),
    ).toEqual(['constructor'])
  })

  it('accepts null for a nullable date-time', () => {
    const shape = { date: z.string().datetime().nullable() }

    expect(invalidClientQueryFields(shape, { date: null })).toEqual([])
  })
})
