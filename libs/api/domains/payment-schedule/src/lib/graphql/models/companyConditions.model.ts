import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaymentScheduleCompanyConditions {
  @Field(() => ID)
  nationalId!: string

  @Field(() => Number)
  maxDebtAmount!: number

  @Field(() => Number)
  totalDebtAmount!: number

  @Field(() => Number)
  minPayment!: number

  @Field(() => Number)
  maxPayment!: number

  @Field(() => Boolean)
  collectionActions!: boolean

  @Field(() => Boolean)
  doNotOwe!: boolean

  @Field(() => Boolean)
  maxDebt!: boolean

  @Field(() => Boolean)
  taxReturns!: boolean

  @Field(() => Boolean)
  vatReturns!: boolean

  @Field(() => Boolean)
  citReturns!: boolean

  @Field(() => Boolean)
  accommodationTaxReturns!: boolean

  @Field(() => Boolean)
  withholdingTaxReturns!: boolean

  @Field(() => Boolean)
  financialStatement!: boolean
}
