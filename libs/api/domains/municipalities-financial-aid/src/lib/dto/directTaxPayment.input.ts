import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidDirectTaxPaymentInput')
export class DirectTaxPaymentInput {
  @Allow()
  @Field()
  readonly totalSalary!: number

  @Allow()
  @Field()
  readonly payerNationalId!: string

  @Allow()
  @Field()
  readonly personalAllowance!: number

  @Allow()
  @Field()
  readonly withheldAtSource!: number

  @Allow()
  @Field()
  readonly month!: number

  @Allow()
  @Field()
  readonly year!: number
}
