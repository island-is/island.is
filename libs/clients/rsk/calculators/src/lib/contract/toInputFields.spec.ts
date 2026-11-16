import { z } from 'zod'

import { toInputFields } from './toInputFields'

const shape = {
  tekjuar: z.number().int().gte(2018).lte(2025).default(2025),
  laun: z.number().int().gte(0).lte(2147483647),
  orlof: z.number().int().gte(0).optional(),
  hlutfall: z.number().gte(0).lte(1),
  manudur: z.enum(['jan', 'feb']),
  rafbill: z.boolean(),
  bilnumer: z.string(),
  gjaldskipting: z.string().datetime().optional(),
}

const fieldNamed = (name: string) =>
  toInputFields(shape).find((field) => field.name === name)

describe('toInputFields', () => {
  it('passes integer bounds and defaults through as currency', () => {
    expect(fieldNamed('tekjuar')).toEqual({
      name: 'tekjuar',
      type: 'number',
      required: true,
      semantic: 'currency',
      integer: true,
      minimum: 2018,
      maximum: 2025,
      defaultValue: 2025,
    })
  })

  it('marks optional params as not required', () => {
    expect(fieldNamed('laun')?.required).toBe(true)
    expect(fieldNamed('orlof')?.required).toBe(false)
  })

  it('exposes 0–1 ratios as whole percentages', () => {
    expect(fieldNamed('hlutfall')).toMatchObject({
      semantic: 'percentage',
      integer: false,
      minimum: 0,
      maximum: 100,
    })
  })

  it('maps enums to select options', () => {
    expect(fieldNamed('manudur')).toEqual({
      name: 'manudur',
      type: 'select',
      required: true,
      options: [{ value: 'jan' }, { value: 'feb' }],
    })
  })

  it('maps booleans, strings and datetimes', () => {
    expect(fieldNamed('rafbill')?.type).toBe('boolean')
    expect(fieldNamed('bilnumer')?.type).toBe('string')
    expect(fieldNamed('gjaldskipting')).toEqual({
      name: 'gjaldskipting',
      type: 'date',
      required: false,
    })
  })

  it('skips unsupported schemas', () => {
    expect(toInputFields({ tags: z.array(z.string()) })).toEqual([])
  })
})
