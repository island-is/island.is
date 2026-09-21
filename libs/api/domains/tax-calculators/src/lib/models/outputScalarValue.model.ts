import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorOutputFieldType } from './enums'

/* Flat and tagged rather than an interface hierarchy, unlike the metadata
 * models: every value carries a key and exactly one payload, so there is no
 * per-type field for an interface to earn its keep with. The consumer is one
 * generic renderer placing values by `key`, and a hierarchy would make it
 * enumerate concrete types through inline fragments to read a fact the
 * metadata contract already stated once. */
@ObjectType('TaxCalculatorOutputScalarValue', {
  description:
    'One scalar value inside an array row. Exactly one of the payload fields is set, chosen by `type`.',
})
export class OutputScalarValue {
  @Field({
    description:
      'The `key` of the item field this value belongs to, as published in the array output field’s `itemFields`.',
  })
  key!: string

  @Field(() => TaxCalculatorOutputFieldType, {
    description:
      'Which payload field is set: `NUMBER` sets `numberValue`, `BOOLEAN` sets `booleanValue`, and `STRING` and `DATE` both set `stringValue`. Never `ARRAY` -- rows do not nest.',
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
}
