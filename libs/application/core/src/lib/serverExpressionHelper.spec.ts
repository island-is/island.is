import { serverExpr } from './serverExpressionHelper'
import { z } from 'zod'

describe('serverExpressionHelper', () => {
  it('builds answer references', () => {
    expect(serverExpr.answer('hasSpouse')).toEqual({ field: 'hasSpouse' })
  })

  it('builds equality conditions', () => {
    expect(serverExpr.equals(serverExpr.answer('hasSpouse'), 'yes')).toEqual({
      field: 'hasSpouse',
      equals: 'yes',
    })
  })

  it('builds non-equality conditions', () => {
    expect(serverExpr.notEquals(serverExpr.answer('status'), 'draft')).toEqual({
      field: 'status',
      notEquals: 'draft',
    })
  })

  it('builds contains conditions', () => {
    expect(
      serverExpr.contains(serverExpr.answer('selectedItems'), 'child'),
    ).toEqual({
      field: 'selectedItems',
      contains: 'child',
    })
  })

  it('builds numeric comparison conditions', () => {
    expect(serverExpr.gt(serverExpr.answer('age'), 17)).toEqual({
      field: 'age',
      gt: 17,
    })
    expect(serverExpr.gte(serverExpr.answer('age'), 18)).toEqual({
      field: 'age',
      gte: 18,
    })
    expect(serverExpr.lt(serverExpr.answer('age'), 67)).toEqual({
      field: 'age',
      lt: 67,
    })
    expect(serverExpr.lte(serverExpr.answer('age'), 66)).toEqual({
      field: 'age',
      lte: 66,
    })
  })

  it('builds all conditions', () => {
    expect(
      serverExpr.all(
        serverExpr.equals(serverExpr.answer('hasSpouse'), 'yes'),
        serverExpr.notEquals(serverExpr.answer('status'), 'draft'),
      ),
    ).toEqual({
      all: [
        { field: 'hasSpouse', equals: 'yes' },
        { field: 'status', notEquals: 'draft' },
      ],
    })
  })

  it('builds any conditions', () => {
    expect(
      serverExpr.any(
        serverExpr.equals(serverExpr.answer('status'), 'married'),
        serverExpr.equals(serverExpr.answer('status'), 'cohabiting'),
      ),
    ).toEqual({
      any: [
        { field: 'status', equals: 'married' },
        { field: 'status', equals: 'cohabiting' },
      ],
    })
  })

  it('builds schema-typed equality conditions with the same runtime payload', () => {
    const schema = z.object({
      age: z.number().optional(),
      status: z.enum(['draft', 'submitted']).optional(),
      text: z.string().optional(),
    })
    const typedServerExpr = serverExpr.forSchema<typeof schema>()

    expect(
      typedServerExpr.equals(typedServerExpr.answer('status'), 'submitted'),
    ).toEqual({
      field: 'status',
      equals: 'submitted',
    })
  })

  it('builds schema-typed numeric conditions with the same runtime payload', () => {
    const schema = z.object({
      age: z.number().optional(),
      status: z.enum(['draft', 'submitted']).optional(),
    })
    const typedServerExpr = serverExpr.forSchema<typeof schema>()

    expect(typedServerExpr.gte(typedServerExpr.answer('age'), 18)).toEqual({
      field: 'age',
      gte: 18,
    })
  })

  it('type-checks schema answer ids and comparison values', () => {
    const schema = z.object({
      age: z.number().optional(),
      status: z.enum(['draft', 'submitted']).optional(),
      selectedItems: z.array(z.enum(['child', 'adult'])).optional(),
      accepted: z.boolean().optional(),
    })
    const typedServerExpr = serverExpr.forSchema<typeof schema>()

    typedServerExpr.equals(typedServerExpr.answer('status'), 'draft')
    typedServerExpr.gt(typedServerExpr.answer('age'), 17)
    typedServerExpr.contains(typedServerExpr.answer('selectedItems'), 'child')

    // @ts-expect-error Invalid answer id.
    typedServerExpr.answer('missing')

    // @ts-expect-error Invalid enum value for this answer.
    typedServerExpr.equals(typedServerExpr.answer('status'), 'approved')

    // @ts-expect-error Numeric comparators only accept numeric answer fields.
    typedServerExpr.gt(typedServerExpr.answer('status'), 1)

    // @ts-expect-error Contains only accepts array answer fields.
    typedServerExpr.contains(typedServerExpr.answer('status'), 'draft')

    // @ts-expect-error Contains only accepts values present in the array item type.
    typedServerExpr.contains(typedServerExpr.answer('selectedItems'), 'senior')

    // @ts-expect-error Server condition values only support string and number.
    typedServerExpr.equals(typedServerExpr.answer('accepted'), true)
  })
})
