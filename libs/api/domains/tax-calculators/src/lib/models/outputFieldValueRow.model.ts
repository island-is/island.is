import { Field, ObjectType } from '@nestjs/graphql'

import { OutputScalarValue } from './outputScalarValue.model'

/* Wrapper preserves each row as a distinct value. */
@ObjectType('TaxCalculatorOutputFieldValueRow', {
  description: 'Row in an array or object output.',
})
export class OutputFieldValueRow {
  @Field(() => [OutputScalarValue], {
    description:
      'Values in this row, keyed by item-field key. Values without a result are omitted.',
  })
  values!: OutputScalarValue[]
}
