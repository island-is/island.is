import { Field, ObjectType } from '@nestjs/graphql'

import { Calculation } from './calculation.model'
import { CalculationError } from './calculationError.model'

/* The two fields are mutually exclusive: a calculation either runs completely
 * or not at all, so there is no partial result to report alongside errors. */
@ObjectType('TaxCalculatorCalculateResponse')
export class CalculateResponse {
  @Field(() => Calculation, { nullable: true })
  calculation?: Calculation

  @Field(() => [CalculationError])
  errors!: CalculationError[]
}
