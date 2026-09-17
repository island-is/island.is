import { Field, ObjectType } from '@nestjs/graphql'

import { OutputScalarValue } from './outputScalarValue.model'

/* A named wrapper rather than a bare nested list, which GraphQL would allow:
 * it reads better in a query document and leaves somewhere to hang future
 * per-row fields. */
@ObjectType('TaxCalculatorOutputFieldValueRow', {
  description: 'One row of an array output field.',
})
export class OutputFieldValueRow {
  @Field(() => [OutputScalarValue], {
    description:
      'The values in this row, keyed by item field. A row omits keys RSK returned no value for, so rows are not guaranteed to be the same length.',
  })
  values!: OutputScalarValue[]
}
