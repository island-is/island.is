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
      description:
        'A whole percent, for example `37` rather than `0.37`. Conversion to the ratio RSK expects happens below this boundary.',
    },
    YEAR: { description: 'A calendar year.' },
    MONTH: {
      description:
        'A month number. RSK does not document whether it counts from 0 or from 1, so no range is asserted.',
    },
    COUNT: { description: 'A non-negative whole count of something.' },
  },
})

export enum TaxCalculatorOutputFieldType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  DATE = 'date',
  ARRAY = 'array',
}

registerEnumType(TaxCalculatorOutputFieldType, {
  name: 'TaxCalculatorOutputFieldType',
  description: 'What kind of value a calculator output field carries.',
  valuesMap: {
    NUMBER: {
      description: 'A numeric result.',
    },
    STRING: { description: 'A text result.' },
    BOOLEAN: { description: 'A yes/no result.' },
    DATE: {
      description:
        'A calendar date. Its value is a `yyyy-MM-dd` string, not a timestamp.',
    },
    ARRAY: {
      description: 'A repeating group rather than a single value.',
    },
  },
})

export enum TaxCalculatorOutputFieldSemantic {
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  YEAR = 'year',
  MONTH = 'month',
  COUNT = 'count',
}

registerEnumType(TaxCalculatorOutputFieldSemantic, {
  name: 'TaxCalculatorOutputFieldSemantic',
  description:
    "What a number output field's value means, and how it should be formatted. Presentational only -- it asserts no range.",
  valuesMap: {
    CURRENCY: { description: 'A whole amount in ISK.' },
    PERCENTAGE: {
      description: 'A percentage-like numeric value. No scale is asserted.',
    },
    YEAR: { description: 'A calendar year.' },
    MONTH: {
      description:
        'A month number. RSK does not document whether it counts from 0 or from 1, so no range is asserted.',
    },
    COUNT: { description: 'A non-negative whole count of something.' },
  },
})

/* Unlike the enums above, this one mirrors no client literal union. GraphQL
 * only ever sees the member names; the values exist to keep the TypeScript
 * side readable. */
export enum TaxCalculatorCalculationErrorCode {
  INVALID_VALUE = 'invalidValue',
  MISSING_REQUIRED_VALUE = 'missingRequiredValue',
  INAPPLICABLE_VALUE = 'inapplicableValue',
  UNKNOWN_FIELD = 'unknownField',
  DUPLICATE_FIELD = 'duplicateField',
  CALCULATION_FAILED = 'calculationFailed',
  EMPTY_RESULT = 'emptyResult',
}

registerEnumType(TaxCalculatorCalculationErrorCode, {
  name: 'TaxCalculatorCalculationErrorCode',
  description:
    'Why a calculation did not produce a result. This is the contract -- switch on it rather than parsing the accompanying `message`.',
  valuesMap: {
    INVALID_VALUE: {
      description:
        "A submitted value does not satisfy its field's contract: the wrong kind, a value outside a select field's options, a malformed date, or a fraction where a whole number is required. Carries the field `key`.",
    },
    MISSING_REQUIRED_VALUE: {
      description:
        'A field RSK requires was not submitted, and its dependency -- if it has one -- is met. Carries the field `key`.',
    },
    INAPPLICABLE_VALUE: {
      description:
        'A value was submitted for a field whose `dependsOn` condition the other submitted values do not meet. Carries the field `key`.',
    },
    UNKNOWN_FIELD: {
      description:
        "A submitted key is not in this calculator's input contract. Carries the submitted `key`.",
    },
    DUPLICATE_FIELD: {
      description:
        'The same key was submitted more than once. Carries that `key`.',
    },
    CALCULATION_FAILED: {
      description:
        'RSK rejected the calculation or could not be reached. Calculation-level, so it carries no `key`. The underlying failure is logged server-side and deliberately not surfaced here.',
    },
    EMPTY_RESULT: {
      description:
        'RSK answered successfully but returned no result body. Calculation-level, so it carries no `key`.',
    },
  },
})
