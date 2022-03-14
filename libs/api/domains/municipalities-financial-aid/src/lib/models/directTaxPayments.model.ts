import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DirectTaxPaymentModel {
  @Field()
  readonly totalSalary!: number

  @Field()
  readonly payerNationalId!: string

  @Field()
  readonly personalAllowance!: number

  @Field()
  readonly withheldAtSource!: number

  @Field()
  readonly month!: number

  @Field()
  readonly year!: number

  @Field(() => String)
  readonly userType!: string
}
