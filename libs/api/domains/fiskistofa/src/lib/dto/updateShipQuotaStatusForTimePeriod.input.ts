import { CacheField } from '@island.is/nest/graphql'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
class FiskistofaQuotaCategoryChange {
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
export class FiskistofaUpdateShipQuotaStatusForTimePeriodInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @CacheField(() => FiskistofaQuotaCategoryChange)
  change!: FiskistofaQuotaCategoryChange
}
