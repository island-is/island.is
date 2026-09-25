import { registerEnumType } from '@nestjs/graphql'

import { TaxCalculatorType } from '@island.is/tax-calculators'

registerEnumType(TaxCalculatorType, { name: 'TaxCalculatorType' })

/* Values mirror source field-type literals for direct mapping. */
export enum TaxCalculatorInputFieldType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECT = 'select',
}

registerEnumType(TaxCalculatorInputFieldType, {
  name: 'TaxCalculatorInputFieldType',
  valuesMap: {
    DATE: {
      description: 'Calendar date encoded as `yyyy-MM-dd`.',
    },
    SELECT: {
      description: 'One of the field’s `options` values.',
    },
  },
})

/* Numeric semantics identify value meaning; selected semantics also define
 * validated ranges. */
export enum TaxCalculatorInputFieldSemantic {
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  YEAR = 'year',
  MONTH = 'month',
  COUNT = 'count',
}

registerEnumType(TaxCalculatorInputFieldSemantic, {
  name: 'TaxCalculatorInputFieldSemantic',
  description: 'Meaning of a numeric input value.',
  valuesMap: {
    CURRENCY: { description: 'Whole ISK amount.' },
    PERCENTAGE: {
      description: 'Whole percent, for example `37`.',
    },
    YEAR: { description: 'A calendar year.' },
    MONTH: { description: 'Month number.' },
    COUNT: { description: 'Non-negative whole-number count.' },
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
  valuesMap: {
    DATE: {
      description: 'Calendar date encoded as `yyyy-MM-dd`.',
    },
    ARRAY: {
      description: 'Sequence of rows.',
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
  description: 'Meaning of a numeric output value.',
  valuesMap: {
    CURRENCY: { description: 'Whole ISK amount.' },
    PERCENTAGE: {
      description: 'Whole percent, for example `37`.',
    },
    YEAR: { description: 'A calendar year.' },
    MONTH: { description: 'Month number.' },
    COUNT: { description: 'Non-negative whole-number count.' },
  },
})

/* GraphQL exposes member names; string values keep TypeScript code readable. */
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
  description: 'Reason a calculation produced no result.',
  valuesMap: {
    INVALID_VALUE: {
      description:
        'Submitted value violates its field contract. Includes the field key.',
    },
    MISSING_REQUIRED_VALUE: {
      description:
        'Required applicable field was not submitted. Includes the field key.',
    },
    INAPPLICABLE_VALUE: {
      description:
        'Submitted field’s dependency is unmet. Includes the field key.',
    },
    UNKNOWN_FIELD: {
      description: 'Submitted key is not an input field. Includes that key.',
    },
    DUPLICATE_FIELD: {
      description: 'Key was submitted more than once. Includes that key.',
    },
    CALCULATION_FAILED: {
      description: 'Calculation was rejected or unavailable.',
    },
    EMPTY_RESULT: {
      description: 'Calculator returned no result body.',
    },
  },
})
