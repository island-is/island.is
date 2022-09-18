import { Field, InputType } from '@nestjs/graphql'

@InputType()
class QuotaCategoryChange {
  @Field()
  id!: number

  @Field()
  nextYearFromQuota!: number

  @Field()
  nextYearQuota!: number

  @Field()
  quotaShare!: number

  @Field()
  allocatedCatchQuota!: number
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
