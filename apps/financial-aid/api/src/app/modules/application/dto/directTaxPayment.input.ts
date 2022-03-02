import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { DirectTaxPayment } from '@island.is/financial-aid/shared/lib'

@InputType()
export class DirectTaxPaymentInput implements DirectTaxPayment {
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
