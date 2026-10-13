import type { CalculatorField } from '@island.is/clients/rsk/calculators'

import { TaxCalculatorCalculationErrorCode } from '../../models/enums'
import type { InputFieldValue } from '../../models/inputFieldValue.model'
import { validateCalculationInput } from './submission'

const fields: readonly CalculatorField[] = [
  { name: 'amount', type: 'number', required: true, semantic: 'currency' },
  { name: 'year', type: 'number', required: false, semantic: 'year' },
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
  { name: 'billingMonth', type: 'number', required: false, semantic: 'month' },
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
    it('accepts a real calendar date', () => {
      expect(
        validate([number('amount', 1), string('startedAt', '2026-02-28')])
          .errors,
      ).toEqual([])
    })

    it('rejects a date that does not exist', () => {
      expect(
        codes([number('amount', 1), string('startedAt', '2026-02-31')]),
      ).toEqual([[INVALID_VALUE, 'startedAt']])
    })

    it('rejects an unpadded date', () => {
      expect(
        codes([number('amount', 1), string('startedAt', '2026-2-3')]),
      ).toEqual([[INVALID_VALUE, 'startedAt']])
    })
  })

  describe('numbers', () => {
    it('accepts a fraction where no integer semantic applies', () => {
      expect(validate([number('amount', 1000.5)]).errors).toEqual([])
    })

    it.each(['year', 'childrenUnder7'])(
      'rejects a fraction for the integer-semantic field %s',
      (key) => {
        expect(
          codes([
            number('amount', 1),
            boolean('splitCustody', true),
            number(key, 2.5),
          ]),
        ).toEqual([[INVALID_VALUE, key]])
      },
    )

    it('rejects a negative count', () => {
      expect(
        codes([
          number('amount', 1),
          boolean('splitCustody', true),
          number('childrenUnder7', -1),
        ]),
      ).toEqual([[INVALID_VALUE, 'childrenUnder7']])
    })

    it('accepts a count of zero', () => {
      expect(
        validate([
          number('amount', 1),
          boolean('splitCustody', true),
          number('childrenUnder7', 0),
        ]).errors,
      ).toEqual([])
    })

    it('leaves a negative value alone where no count semantic applies', () => {
      expect(validate([number('amount', -500)]).errors).toEqual([])
    })

    it.each([-1, 101])('rejects a percentage outside 0-100 (%d)', (value) => {
      expect(codes([number('amount', 1), number('taxRate', value)])).toEqual([
        [INVALID_VALUE, 'taxRate'],
      ])
    })

    it.each([0, 100])('accepts a percentage boundary (%d)', (value) => {
      expect(
        validate([number('amount', 1), number('taxRate', value)]).errors,
      ).toEqual([])
    })

    it.each([0, 13])('rejects a month outside 1-12 (%d)', (value) => {
      expect(
        codes([number('amount', 1), number('billingMonth', value)]),
      ).toEqual([[INVALID_VALUE, 'billingMonth']])
    })

    it.each([1, 12])('accepts a month boundary (%d)', (value) => {
      expect(
        validate([number('amount', 1), number('billingMonth', value)]).errors,
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
