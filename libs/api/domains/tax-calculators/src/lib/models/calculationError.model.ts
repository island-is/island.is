import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorCalculationErrorCode } from './enums'

@ObjectType('TaxCalculatorCalculationError')
export class CalculationError {
  @Field(() => TaxCalculatorCalculationErrorCode, {
    description: 'Why the calculation did not run. This is the contract.',
  })
  code!: TaxCalculatorCalculationErrorCode

  @Field({
    nullable: true,
    description:
      'The input field this error is about. Absent on calculation-level errors, which belong in the result area rather than beside a control.',
  })
  key?: string

  @Field({
    description:
      'Developer-facing English, for logs and debugging. Never render it: it is not localized and not stable. Switch on `code` and supply your own copy.',
  })
  message!: string
}
