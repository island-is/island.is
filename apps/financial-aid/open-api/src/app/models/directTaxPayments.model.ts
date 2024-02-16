import { Field, ObjectType } from '@nestjs/graphql'

import { UserType } from '@island.is/financial-aid/shared/lib'

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
  readonly userType!: UserType
}
