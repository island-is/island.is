import { registerEnumType } from '@nestjs/graphql'
import { TaxCalculatorType } from '@island.is/tax-calculators'

// Declared in @island.is/tax-calculators (plain TS, shared with the web and
// Contentful clients) and registered with GraphQL by libs/cms, which exposes
// the same enum on the Calculator slice.
export { TaxCalculatorType }

export enum TaxCalculatorFieldKind {
  NUMBER = 'number',
  SELECT = 'select',
  BOOLEAN = 'boolean',
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  DATE = 'date',
}

registerEnumType(TaxCalculatorFieldKind, {
  name: 'TaxCalculatorFieldKind',
  description:
    'The kind of input control the web client should render for a calculator field.',
})
