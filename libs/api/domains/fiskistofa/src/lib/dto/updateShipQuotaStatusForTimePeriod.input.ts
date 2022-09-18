import { Field, InputType } from '@nestjs/graphql'

@InputType()
class QuotaCategoryChange {
  @Field()
  id!: number

  @Field({ nullable: true })
  nextYearFromQuota?: number

  @Field({ nullable: true })
  nextYearQuota?: number

  @Field({ nullable: true })
  quotaShare?: number

  @Field({ nullable: true })
  allocatedCatchQuota?: number
}

@InputType()
export class UpdateShipQuotaStatusForTimePeriodInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @Field(() => QuotaCategoryChange)
  change!: QuotaCategoryChange
}
