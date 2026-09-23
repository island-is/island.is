import { Field, ObjectType } from '@nestjs/graphql'

import { Calculation } from './calculation.model'
import { CalculationError } from './calculationError.model'

@ObjectType('TaxCalculatorCalculateResponse')
export class CalculateResponse {
  @Field(() => Calculation, { nullable: true })
  calculation?: Calculation

  @Field(() => [CalculationError])
  errors!: CalculationError[]
}
