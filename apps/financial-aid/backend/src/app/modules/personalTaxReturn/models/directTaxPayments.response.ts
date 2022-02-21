import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DirectTaxPaymentsResponse {
  @Field(() => [DirectTaxPayment], { nullable: true })
  directTaxPayments?: DirectTaxPayment[]
}

class DirectTaxPayment {
  @Field(() => Number)
  totalSalary!: number

  @Field(() => Number)
  payerNationalId!: number

  @Field(() => Number)
  personalAllowance!: number

  @Field(() => Number)
  withheldAtSource!: number

  @Field(() => Number)
  month!: number
}
