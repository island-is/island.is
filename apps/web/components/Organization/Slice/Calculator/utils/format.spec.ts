import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import { formatOutputValue } from './format'

const number = (numberValue: number) => ({
  type: TaxCalculatorOutputFieldType.Number,
  numberValue,
})

describe('formatOutputValue', () => {
  it('formats currency as grouped krona in both locales', () => {
    const value = number(1234567)

    expect(
      formatOutputValue(value, TaxCalculatorOutputFieldSemantic.Currency, 'is'),
    ).toBe('1.234.567 kr.')
    expect(
      formatOutputValue(value, TaxCalculatorOutputFieldSemantic.Currency, 'en'),
    ).toBe('1.234.567 kr.')
  })

  /* Whole percent by contract: the client's mappers convert to and from RSK's
   * 0-1 ratio, so nothing here scales. */
  it('appends the sign to a whole percent without scaling it', () => {
    expect(
      formatOutputValue(
        number(31.45),
        TaxCalculatorOutputFieldSemantic.Percentage,
        'is',
      ),
    ).toBe('31,45%')
  })

  /* Grouped, `2024` would read `2.024`. */
  it('leaves a year and a month ungrouped', () => {
    expect(
      formatOutputValue(
        number(2024),
        TaxCalculatorOutputFieldSemantic.Year,
        'is',
      ),
    ).toBe('2024')
    expect(
      formatOutputValue(
        number(3),
        TaxCalculatorOutputFieldSemantic.Month,
        'is',
      ),
    ).toBe('3')
  })

  it('groups a plain number when no semantic is declared', () => {
    expect(formatOutputValue(number(12345), undefined, 'is')).toBe('12.345')
  })

  it('renders a boolean as localized yes/no', () => {
    const value = {
      type: TaxCalculatorOutputFieldType.Boolean,
      booleanValue: true,
    }

    expect(formatOutputValue(value, undefined, 'is')).toBe('Já')
    expect(formatOutputValue(value, undefined, 'en')).toBe('Yes')
  })

  it('renders a string as it arrived', () => {
    expect(
      formatOutputValue(
        { type: TaxCalculatorOutputFieldType.String, stringValue: 'hali' },
        undefined,
        'is',
      ),
    ).toBe('hali')
  })

  /* Handed to `new Date(...)` the contract's `yyyy-MM-dd` would be read as UTC
   * midnight and shift the day backwards for any viewer west of Greenwich. */
  it('renders a date without shifting the day', () => {
    const formatted = formatOutputValue(
      { type: TaxCalculatorOutputFieldType.Date, stringValue: '2026-03-14' },
      undefined,
      'is',
    )

    expect(formatted).toContain('14')
    expect(formatted).toContain('2026')
  })

  /* A row RSK returned nothing for must be omitted, not rendered blank. */
  it('returns undefined when the payload the type points at is absent', () => {
    expect(
      formatOutputValue(
        { type: TaxCalculatorOutputFieldType.Number, numberValue: null },
        undefined,
        'is',
      ),
    ).toBeUndefined()
    expect(
      formatOutputValue(
        { type: TaxCalculatorOutputFieldType.String },
        undefined,
        'is',
      ),
    ).toBeUndefined()
  })
})
