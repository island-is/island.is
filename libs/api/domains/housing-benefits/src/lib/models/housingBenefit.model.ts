import { PaginatedResponse } from '@island.is/nest/pagination'
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HousingBenefitPayment {
  @Field(() => Int, { nullable: true })
  nr?: number

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => Int, { nullable: true })
  noDays?: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateCalculation?: Date | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTransfer?: Date | null

  @Field(() => String, { nullable: true })
  month?: string | null

  @Field(() => String, { nullable: true })
  transactionType?: string | null

  @Field(() => String, { nullable: true })
  calculationType?: string | null

  @Field(() => Int, { nullable: true })
  paymentActual?: number

  @Field(() => String, { nullable: true })
  bankAccountMerged?: string | null

  @Field(() => Int, { nullable: true })
  paidOfDebt?: number | null

  @Field(() => Int, { nullable: true })
  paymentBeforeDebt?: number

  @Field(() => Int, { nullable: true })
  benefit?: number | null

  @Field(() => Int, { nullable: true })
  reductionIncome?: number | null

  @Field(() => Int, { nullable: true })
  reductionAssets?: number | null

  @Field(() => Int, { nullable: true })
  reductionHousingCost?: number | null

  @Field(() => Int, { nullable: true })
  totalIncome?: number | null

  @Field(() => Int, { nullable: true })
  remainDebt?: number | null

  @Field(() => Int, { nullable: true })
  paymentOrigin?: number | null
}

@ObjectType('HousingBenefitPayments')
export class HousingBenefitPaymentsResponse extends PaginatedResponse(
  HousingBenefitPayment,
) {}
