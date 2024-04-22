import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import {
  TransactionTypes,
  CalculationTypes,
} from '@island.is/clients/hms-housing-benefits'

registerEnumType(TransactionTypes, { name: 'TransactionType' })
registerEnumType(CalculationTypes, { name: 'CalculationType' })

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

  @Field(() => TransactionTypes, { nullable: true })
  transactionType?: TransactionTypes | null

  @Field(() => CalculationTypes, { nullable: true })
  calculationType?: CalculationTypes | null

  @Field(() => String, { nullable: true })
  bankAccountMerged?: string | null

  @Field(() => Int, { nullable: true })
  paymentActual?: number

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
