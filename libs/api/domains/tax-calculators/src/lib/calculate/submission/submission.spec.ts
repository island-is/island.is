import type { CalculatorField } from '@island.is/clients/rsk/calculators'

import { TaxCalculatorCalculationErrorCode } from '../../models/enums'
import type { InputFieldValue } from '../../models/inputFieldValue.model'
import { toInvalidValueErrors, validateCalculationInput } from './submission'

const fields: readonly CalculatorField[] = [
  { name: 'amount', type: 'number', required: true, semantic: 'currency' },
  { name: 'note', type: 'string', required: false },
  { name: 'startedAt', type: 'date', required: false },
  { name: 'splitCustody', type: 'boolean', required: false },
  {
    name: 'period',
    type: 'select',
    required: false,
    options: [{ value: 'firstHalf' }, { value: 'secondHalf' }],
  },
  {
    name: 'childrenUnder7',
    type: 'number',
    required: false,
    semantic: 'count',
    dependsOn: { field: 'splitCustody', equals: true },
  },
  { name: 'taxRate', type: 'number', required: false, semantic: 'percentage' },
]

const number = (key: string, numberValue: number): InputFieldValue => ({
  key,
  value: { numberValue },
})

const string = (key: string, stringValue: string): InputFieldValue => ({
  key,
  value: { stringValue },
})

const boolean = (key: string, booleanValue: boolean): InputFieldValue => ({
  key,
  value: { booleanValue },
})

const date = (key: string, dateValue: Date): InputFieldValue => ({
  key,
  value: { dateValue },
})

const validate = (submitted: InputFieldValue[]) =>
  validateCalculationInput(fields, submitted)

const codes = (submitted: InputFieldValue[]) =>
  validate(submitted).errors.map((error) => [error.code, error.key])

const {
  INVALID_VALUE,
  MISSING_REQUIRED_VALUE,
  INAPPLICABLE_VALUE,
  UNKNOWN_FIELD,
  DUPLICATE_FIELD,
} = TaxCalculatorCalculationErrorCode

describe('validateCalculationInput', () => {
  it('accepts a minimal valid submission', () => {
    const result = validate([number('amount', 1000)])

    expect(result.errors).toEqual([])
    expect(result.values).toEqual({ amount: 1000 })
  })

  it('rejects a duplicate key once, however often it repeats', () => {
    expect(
      codes([number('amount', 1), number('amount', 2), number('amount', 3)]),
    ).toEqual([[DUPLICATE_FIELD, 'amount']])
  })

  it('rejects a key the contract does not declare', () => {
    expect(codes([number('amount', 1), number('nope', 1)])).toEqual([
      [UNKNOWN_FIELD, 'nope'],
    ])
  })

  it('rejects a value of the wrong kind', () => {
    expect(codes([string('amount', '1000')])).toEqual([
      [INVALID_VALUE, 'amount'],
    ])
  })

  it('reports a missing required field', () => {
    expect(codes([])).toEqual([[MISSING_REQUIRED_VALUE, 'amount']])
  })

  it('reports every failing field rather than the first', () => {
    expect(
      codes([string('period', 'thirdHalf'), string('startedAt', 'nope')]),
    ).toEqual([
      [MISSING_REQUIRED_VALUE, 'amount'],
      [INVALID_VALUE, 'startedAt'],
      [INVALID_VALUE, 'period'],
    ])
  })

  describe('select options', () => {
    it('accepts a declared option', () => {
      expect(
        validate([number('amount', 1), string('period', 'firstHalf')]).errors,
      ).toEqual([])
    })

    it('rejects an undeclared option', () => {
      expect(
        codes([number('amount', 1), string('period', 'thirdHalf')]),
      ).toEqual([[INVALID_VALUE, 'period']])
    })
  })

  describe('dates', () => {
    it('accepts a date', () => {
      const startedAt = new Date('2026-02-28T00:00:00.000Z')
      const result = validate([
        number('amount', 1),
        date('startedAt', startedAt),
      ])

      expect(result.errors).toEqual([])
      expect(result.values.startedAt).toBe(startedAt)
    })

    it('rejects a string for a date field', () => {
      expect(
        codes([number('amount', 1), string('startedAt', '2026-02-28')]),
      ).toEqual([[INVALID_VALUE, 'startedAt']])
    })
  })

  describe('numbers', () => {
    it('leaves integer and range checks to the client', () => {
      expect(
        validate([
          number('amount', 2.5),
          boolean('splitCustody', true),
          number('childrenUnder7', -1),
          number('taxRate', 150),
        ]).errors,
      ).toEqual([])
    })

    it('preserves zero rather than reading it as absent', () => {
      expect(validate([number('amount', 0)]).values).toEqual({ amount: 0 })
    })
  })

  describe('absent values', () => {
    it('reads an empty string as no value at all', () => {
      const result = validate([number('amount', 1), string('note', '')])

      expect(result.errors).toEqual([])
      expect(result.values).toEqual({ amount: 1 })
    })

    it('reads an empty required string as missing', () => {
      expect(
        validateCalculationInput(
          [{ name: 'note', type: 'string', required: true }],
          [string('note', '')],
        ).errors.map((error) => error.code),
      ).toEqual([MISSING_REQUIRED_VALUE])
    })

    it('preserves false rather than reading it as absent', () => {
      expect(
        validate([number('amount', 1), boolean('splitCustody', false)]).values,
      ).toEqual({
        amount: 1,
        splitCustody: false,
      })
    })
  })

  describe('dependencies', () => {
    it('accepts a dependent field when its condition is met', () => {
      const result = validate([
        number('amount', 1),
        boolean('splitCustody', true),
        number('childrenUnder7', 2),
      ])

      expect(result.errors).toEqual([])
      expect(result.values.childrenUnder7).toBe(2)
    })

    it.each([
      ['submitted false', [boolean('splitCustody', false)]],
      ['not submitted at all', []],
    ])('rejects a dependent field when its target is %s', (_label, target) => {
      expect(
        codes([number('amount', 1), ...target, number('childrenUnder7', 2)]),
      ).toEqual([[INAPPLICABLE_VALUE, 'childrenUnder7']])
    })

    it('drops an inapplicable value rather than forwarding it', () => {
      expect(
        validate([number('amount', 1), number('childrenUnder7', 2)]).values,
      ).toEqual({ amount: 1 })
    })

    it('does not require a required field whose dependency is unmet', () => {
      expect(
        validateCalculationInput(
          [
            { name: 'splitCustody', type: 'boolean', required: false },
            {
              name: 'childrenUnder7',
              type: 'number',
              required: true,
              dependsOn: { field: 'splitCustody', equals: true },
            },
          ],
          [],
        ).errors,
      ).toEqual([])
    })
  })
})

describe('toInvalidValueErrors', () => {
  const contract: readonly CalculatorField[] = [
    {
      name: 'year',
      type: 'number',
      required: true,
      integer: true,
      minimum: 2019,
      maximum: 2026,
    },
    { name: 'count', type: 'number', required: false, integer: true },
    { name: 'floor', type: 'number', required: false, minimum: 0 },
    { name: 'cap', type: 'number', required: false, maximum: 100 },
    { name: 'plain', type: 'number', required: false },
    {
      name: 'period',
      type: 'select',
      required: true,
      options: [{ value: 'a' }],
    },
  ]

  it.each([
    ['year', 'Field "year" expects a whole number between 2019 and 2026.'],
    ['count', 'Field "count" expects a whole number.'],
    ['floor', 'Field "floor" expects a number of 0 or more.'],
    ['cap', 'Field "cap" expects a number of 100 or less.'],
    ['plain', 'Field "plain" is not accepted by the calculator.'],
    ['period', 'Field "period" is not accepted by the calculator.'],
    ['unknown', 'Field "unknown" is not accepted by the calculator.'],
  ])('describes a rejected %s from the contract', (key, message) => {
    expect(toInvalidValueErrors(contract, [key])).toEqual([
      { code: INVALID_VALUE, key, message },
    ])
  })
})
