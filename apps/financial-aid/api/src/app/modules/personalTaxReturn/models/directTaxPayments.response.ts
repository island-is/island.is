import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DirectTaxPaymentsResponse {
  @Field(() => [DirectTaxPaymentResponse])
  directTaxPayments!: DirectTaxPaymentResponse[]

  @Field(() => Boolean)
  success!: boolean
}

@ObjectType()
class DirectTaxPaymentResponse {
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
