import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorCalculationErrorCode } from './enums'

@ObjectType('TaxCalculatorCalculationError')
export class CalculationError {
  @Field(() => TaxCalculatorCalculationErrorCode)
  code!: TaxCalculatorCalculationErrorCode

  @Field({
    nullable: true,
    description: 'Input-field key associated with this error, when applicable.',
  })
  key?: string

  @Field()
  message!: string
}
