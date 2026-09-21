import { Field, ObjectType } from '@nestjs/graphql'

import { Calculation } from './calculation.model'
import { CalculationError } from './calculationError.model'

/* The two fields are mutually exclusive: a calculation either runs completely
 * or not at all, so there is no partial result to report alongside errors. */
@ObjectType('TaxCalculatorCalculateResponse')
export class CalculateResponse {
  @Field(() => Calculation, {
    nullable: true,
    description: 'The result. Null whenever `errors` is non-empty.',
  })
  calculation?: Calculation

  @Field(() => [CalculationError], {
    description:
      'Empty when the calculation succeeded. Otherwise every reason it did not run -- validation reports all failing fields at once rather than the first.',
  })
  errors!: CalculationError[]
}
