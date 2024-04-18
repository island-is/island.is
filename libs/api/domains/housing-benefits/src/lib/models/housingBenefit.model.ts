import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class HousingBenefitsPageInfo {
  @Field({ nullable: true })
  hasNextPage!: boolean

  @Field({ nullable: true })
  hasPreviousPage?: boolean
}

@ObjectType()
export class HousingBenefitsPayment {
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

@ObjectType('HousingBenefitsPayments')
export class HousingBenefitsPaymentsResponse {
  @CacheField(() => [HousingBenefitsPayment])
  data!: HousingBenefitsPayment[]

  @Field()
  totalCount!: number

  @CacheField(() => HousingBenefitsPageInfo)
  pageInfo!: HousingBenefitsPageInfo
}
