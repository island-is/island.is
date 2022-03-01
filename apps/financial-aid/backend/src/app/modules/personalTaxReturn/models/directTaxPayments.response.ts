import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DirectTaxPaymentsResponse {
  @Field(() => [DirectTaxPayment])
  directTaxPayments: DirectTaxPayment[]
}

class DirectTaxPayment {
  @Field(() => Number)
  totalSalary!: number

  @Field(() => String)
  payerNationalId!: string

  @Field(() => Number)
  personalAllowance!: number

  @Field(() => Number)
  withheldAtSource!: number

  @Field(() => Number)
  month!: number

  @Field(() => Number)
  year!: number
}
