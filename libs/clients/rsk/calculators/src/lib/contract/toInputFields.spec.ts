import { z } from 'zod'

import { toInputFields } from './toInputFields'

const shape = {
  year: z.number().int().gte(2018).lte(2025).default(2025),
  requiredAmount: z.number().int().gte(0).lte(2147483647),
  optionalAmount: z.number().int().gte(0).optional(),
  ratio: z.number().gte(0).lte(1),
  choice: z.enum(['a', 'b']),
  flag: z.boolean(),
  text: z.string(),
  date: z.string().datetime().optional(),
}

const fieldNamed = (name: string) =>
  toInputFields(shape).find((field) => field.name === name)

describe('toInputFields', () => {
  it('passes integer bounds and defaults through as currency', () => {
    expect(fieldNamed('year')).toEqual({
      name: 'year',
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
    expect(fieldNamed('requiredAmount')?.required).toBe(true)
    expect(fieldNamed('optionalAmount')?.required).toBe(false)
  })

  it('exposes 0–1 ratios as whole percentages', () => {
    expect(fieldNamed('ratio')).toMatchObject({
      semantic: 'percentage',
      integer: false,
      minimum: 0,
      maximum: 100,
    })
  })

  it('maps enums to select options', () => {
    expect(fieldNamed('choice')).toEqual({
      name: 'choice',
      type: 'select',
      required: true,
      options: [{ value: 'a' }, { value: 'b' }],
    })
  })

  it('maps booleans, strings and datetimes', () => {
    expect(fieldNamed('flag')?.type).toBe('boolean')
    expect(fieldNamed('text')?.type).toBe('string')
    expect(fieldNamed('date')).toEqual({
      name: 'date',
      type: 'date',
      required: false,
    })
  })

  it('skips unsupported schemas', () => {
    expect(toInputFields({ tags: z.array(z.string()) })).toEqual([])
  })
})
