import { registerEnumType } from '@nestjs/graphql'

/* Mirrors `InputProp['dataType']` from @island.is/clients/rsk/calculators,
 * which derives it from each calculator's zod schema. Member names are
 * uppercase to match the neighbouring TaxCalculatorType rather than the
 * lowercase style used elsewhere in the API. */
export enum TaxCalculatorFieldDataType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  DATE = 'date',
  ENUM = 'enum',
}

registerEnumType(TaxCalculatorFieldDataType, {
  name: 'TaxCalculatorFieldDataType',
  description: 'The kind of control a calculator input field expects.',
})
