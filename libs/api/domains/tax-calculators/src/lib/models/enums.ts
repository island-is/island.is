import { registerEnumType } from '@nestjs/graphql'

/* Mirrors `InputProp['inputType']` from @island.is/clients/rsk/calculators,
 * which derives it from each calculator's zod schema. Member names are
 * uppercase to match the neighbouring TaxCalculatorType rather than the
 * lowercase style used elsewhere in the API.
 *
 * The semantic numeric members are not structural: RSK types every one of
 * them as a plain number, so they exist purely to tell a renderer how to
 * format and constrain the input. NUMBER is the fallback for a numeric field
 * the client has not yet annotated. */
export enum TaxCalculatorFieldInputType {
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  YEAR = 'year',
  MONTH = 'month',
  COUNT = 'count',
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  DATE = 'date',
  ENUM = 'enum',
}

/* Per-member descriptions live in `valuesMap` rather than on the consuming
 * field: a consumer reading the schema meets the semantics on the enum type
 * itself, which is where they look, and the field's own description does not
 * have to restate a list that changes every time the enum grows. */
registerEnumType(TaxCalculatorFieldInputType, {
  name: 'TaxCalculatorFieldInputType',
  description:
    'What control a calculator input field expects, and how its value should be formatted.',
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
    NUMBER: {
      description:
        'A numeric field carrying no presentation semantic. Render it plainly.',
    },
    STRING: { description: 'Free text.' },
    BOOLEAN: { description: 'A yes/no toggle.' },
    DATE: { description: 'A calendar date.' },
    ENUM: {
      description:
        "One of a fixed set of values, listed in the field's `options`.",
    },
  },
})
