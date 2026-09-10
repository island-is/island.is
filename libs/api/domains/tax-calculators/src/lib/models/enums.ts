import { registerEnumType } from '@nestjs/graphql'

/* Values mirror the literals in @island.is/clients/rsk/calculators'
 * CalculatorFieldType, so mapping across the boundary stays a plain Record
 * lookup rather than a translation table. */
export enum TaxCalculatorInputFieldType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECT = 'select',
}

registerEnumType(TaxCalculatorInputFieldType, {
  name: 'TaxCalculatorInputFieldType',
  description: 'Which kind of control a calculator input field expects.',
  valuesMap: {
    NUMBER: {
      description:
        'A numeric input. See `semantic` on the number field for what the number means.',
    },
    STRING: { description: 'Free text.' },
    BOOLEAN: { description: 'A yes/no toggle.' },
    DATE: {
      description:
        'A calendar date. Its value is a `yyyy-MM-dd` string, not a timestamp.',
    },
    SELECT: {
      description:
        "One of a fixed set of values, listed in the field's `options`.",
    },
  },
})

/* Mirrors CalculatorFieldSemantic in the client. Purely presentational: RSK
 * types every one of these as a plain number, so a semantic says how to format
 * and label an input, never what range it may take. */
export enum TaxCalculatorInputFieldSemantic {
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  YEAR = 'year',
  MONTH = 'month',
  COUNT = 'count',
}

registerEnumType(TaxCalculatorInputFieldSemantic, {
  name: 'TaxCalculatorInputFieldSemantic',
  description:
    "What a number input field's value means, and how it should be formatted. Presentational only -- it asserts no range.",
  valuesMap: {
    CURRENCY: { description: 'A whole amount in ISK.' },
    PERCENTAGE: {
      description: 'A ratio between 0 and 1, not a 0-100 figure.',
    },
    YEAR: { description: 'A calendar year.' },
    MONTH: {
      description:
        'A month number. RSK does not document whether it counts from 0 or from 1, so no range is asserted.',
    },
    COUNT: { description: 'A non-negative whole count of something.' },
  },
})
