import { z } from 'zod'

import { toOutputFields } from './toOutputFields'

const bracket = z.object({
  lowerBound: z.coerce.bigint().optional(),
  rate: z.number().optional(),
})

const period = z.object({
  days: z.number().int().optional(),
})

const shape = {
  amount: z.number().int().optional(),
  ratio: z.number().gte(0).lte(1).optional(),
  flag: z.boolean().optional(),
  label: z.union([z.string(), z.null()]).optional(),
  start: z.string().datetime().optional(),
  rows: z.union([z.array(bracket), z.null()]).optional(),
  group: period.optional(),
  tags: z.array(z.string()).optional(),
  other: z.unknown(),
}

describe('toOutputFields', () => {
  it('derives scalar fields with inferred semantics', () => {
    expect(toOutputFields(shape)).toEqual(
      expect.arrayContaining([
        {
          name: 'amount',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
        {
          name: 'ratio',
          kind: 'scalar',
          type: 'number',
          semantic: 'percentage',
        },
        { name: 'flag', kind: 'scalar', type: 'boolean' },
        { name: 'label', kind: 'scalar', type: 'string' },
        { name: 'start', kind: 'scalar', type: 'date' },
      ]),
    )
  })

  it('derives array item fields, treating bigints as numbers', () => {
    expect(
      toOutputFields(shape).find((field) => field.name === 'rows'),
    ).toEqual({
      name: 'rows',
      kind: 'array',
      itemFields: [
        {
          name: 'lowerBound',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
        {
          name: 'rate',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
      ],
    })
  })

  it('derives object item fields', () => {
    expect(
      toOutputFields(shape).find((field) => field.name === 'group'),
    ).toEqual({
      name: 'group',
      kind: 'object',
      itemFields: [
        { name: 'days', kind: 'scalar', type: 'number', semantic: 'currency' },
      ],
    })
  })

  it('skips unsupported schemas', () => {
    const names = toOutputFields(shape).map((field) => field.name)

    expect(names).not.toContain('tags')
    expect(names).not.toContain('other')
  })
})
