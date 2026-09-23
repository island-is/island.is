import { Field, InterfaceType } from '@nestjs/graphql'

import { TaxCalculatorOutputFieldType } from '../enums'

export const resolveOutputField = (value: OutputField) => {
  switch (value.type) {
    case TaxCalculatorOutputFieldType.NUMBER:
      return 'TaxCalculatorNumberOutputField'
    case TaxCalculatorOutputFieldType.STRING:
      return 'TaxCalculatorStringOutputField'
    case TaxCalculatorOutputFieldType.BOOLEAN:
      return 'TaxCalculatorBooleanOutputField'
    case TaxCalculatorOutputFieldType.DATE:
      return 'TaxCalculatorDateOutputField'
    case TaxCalculatorOutputFieldType.ARRAY:
      return 'TaxCalculatorArrayOutputField'
    default: {
      const unhandled: never = value.type
      return unhandled
    }
  }
}

@InterfaceType('TaxCalculatorOutputField', { resolveType: resolveOutputField })
export abstract class OutputField {
  @Field()
  key!: string

  @Field(() => TaxCalculatorOutputFieldType)
  type!: TaxCalculatorOutputFieldType
}
