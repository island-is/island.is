import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorOutputFieldType } from './enums'
import { OutputFieldValueRow } from './outputFieldValueRow.model'

@ObjectType('TaxCalculatorOutputFieldValue', {
  description: 'Calculated output value. Set exactly one payload matching `type`.',
})
export class OutputFieldValue {
  @Field()
  key!: string

  @Field(() => TaxCalculatorOutputFieldType)
  type!: TaxCalculatorOutputFieldType

  @Field(() => Float, { nullable: true })
  numberValue?: number

  @Field({
    nullable: true,
    description: 'Value for a `STRING` or `DATE` output; dates use `yyyy-MM-dd`.',
  })
  stringValue?: string

  @Field({ nullable: true })
  booleanValue?: boolean

  @Field(() => [OutputFieldValueRow], {
    nullable: true,
    description: 'Rows for an `ARRAY` output. An empty list is a valid result.',
  })
  arrayValue?: OutputFieldValueRow[]
}
