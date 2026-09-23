import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorOutputFieldType } from './enums'

/* Flat tagged values share a key, type, and exactly one payload. */
@ObjectType('TaxCalculatorOutputScalarValue', {
  description:
    'Calculated scalar value in an array row. Set exactly one payload matching `type`.',
})
export class OutputScalarValue {
  @Field()
  key!: string

  @Field(() => TaxCalculatorOutputFieldType)
  type!: TaxCalculatorOutputFieldType

  @Field(() => Float, { nullable: true })
  numberValue?: number

  @Field({
    nullable: true,
    description:
      'Value for a `STRING` or `DATE` item field; dates use `yyyy-MM-dd`.',
  })
  stringValue?: string

  @Field({ nullable: true })
  booleanValue?: boolean
}
