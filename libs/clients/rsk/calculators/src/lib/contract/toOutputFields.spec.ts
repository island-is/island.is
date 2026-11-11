import { z } from 'zod'

import { toOutputFields } from './toOutputFields'

const bracket = z.object({
  nedriMork: z.coerce.bigint().optional(),
  stadgreidsluhlutfall: z.number().optional(),
})

const period = z.object({
  dagar: z.number().int().optional(),
})

const shape = {
  manadarlaun: z.number().int().optional(),
  sereignProsenta: z.number().gte(0).lte(1).optional(),
  reiknadiHatekjuskatt: z.boolean().optional(),
  timabil: z.union([z.string(), z.null()]).optional(),
  upphaf: z.string().datetime().optional(),
  skattthrep: z.union([z.array(bracket), z.null()]).optional(),
  fyrraTimabil: period.optional(),
  tags: z.array(z.string()).optional(),
  annad: z.unknown(),
}

describe('toOutputFields', () => {
  it('derives scalar fields with inferred semantics', () => {
    expect(toOutputFields(shape)).toEqual(
      expect.arrayContaining([
        {
          name: 'manadarlaun',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
        {
          name: 'sereignProsenta',
          kind: 'scalar',
          type: 'number',
          semantic: 'percentage',
        },
        { name: 'reiknadiHatekjuskatt', kind: 'scalar', type: 'boolean' },
        { name: 'timabil', kind: 'scalar', type: 'string' },
        { name: 'upphaf', kind: 'scalar', type: 'date' },
      ]),
    )
  })

  it('derives array item fields, treating bigints as numbers', () => {
    expect(
      toOutputFields(shape).find((field) => field.name === 'skattthrep'),
    ).toEqual({
      name: 'skattthrep',
      kind: 'array',
      itemFields: [
        {
          name: 'nedriMork',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
        {
          name: 'stadgreidsluhlutfall',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
      ],
    })
  })

  it('derives object item fields', () => {
    expect(
      toOutputFields(shape).find((field) => field.name === 'fyrraTimabil'),
    ).toEqual({
      name: 'fyrraTimabil',
      kind: 'object',
      itemFields: [
        { name: 'dagar', kind: 'scalar', type: 'number', semantic: 'currency' },
      ],
    })
  })

  it('skips unsupported schemas', () => {
    const names = toOutputFields(shape).map((field) => field.name)

    expect(names).not.toContain('tags')
    expect(names).not.toContain('annad')
  })
})
