import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorOutputFieldType } from './enums'
import { OutputFieldValueRow } from './outputFieldValueRow.model'

@ObjectType('TaxCalculatorOutputFieldValue', {
  description:
    'One value the calculation produced. Exactly one of the payload fields is set, chosen by `type`.',
})
export class OutputFieldValue {
  @Field({
    description:
      'The `key` of the output field this value belongs to, exactly as the metadata query publishes it.',
  })
  key!: string

  @Field(() => TaxCalculatorOutputFieldType, {
    description:
      'Which payload field is set: `NUMBER` sets `numberValue`, `BOOLEAN` sets `booleanValue`, `STRING` and `DATE` both set `stringValue`, and `ARRAY` sets `arrayValue`.',
  })
  type!: TaxCalculatorOutputFieldType

  @Field(() => Float, {
    nullable: true,
    description: 'Set when `type` is `NUMBER`.',
  })
  numberValue?: number

  @Field({
    nullable: true,
    description:
      'Set when `type` is `STRING` or `DATE`. Dates are `yyyy-MM-dd`.',
  })
  stringValue?: string

  @Field({
    nullable: true,
    description: 'Set when `type` is `BOOLEAN`.',
  })
  booleanValue?: boolean

  @Field(() => [OutputFieldValueRow], {
    nullable: true,
    description:
      'Set when `type` is `ARRAY`. An empty list means RSK returned no rows, which is a result rather than a missing value -- a field RSK returned nothing at all for is omitted from `values` entirely, as any absent scalar is.',
  })
  arrayValue?: OutputFieldValueRow[]
}
