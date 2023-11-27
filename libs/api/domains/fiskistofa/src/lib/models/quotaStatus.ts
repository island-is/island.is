import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
class FiskistofaQuotaStatus {
  @Field({ nullable: true })
  nextYearCatchQuota?: number

  @Field({ nullable: true })
  nextYearQuota?: number

  @Field({ nullable: true })
  nextYearFromQuota?: number

  @Field({ nullable: true })
  totalCatchQuota?: number

  @Field({ nullable: true })
  quotaShare?: number

  @Field({ nullable: true })
  id?: number

  @Field({ nullable: true })
  newStatus?: number

  @Field({ nullable: true })
  unused?: number

  @Field({ nullable: true })
  percentCatchQuotaFrom?: number

  @Field({ nullable: true })
  percentCatchQuotaTo?: number

  @Field({ nullable: true })
  excessCatch?: number

  @Field({ nullable: true })
  allocatedCatchQuota?: number
}

@ObjectType()
export class FiskistofaQuotaStatusResponse {
  @CacheField(() => FiskistofaQuotaStatus, { nullable: true })
  fiskistofaShipQuotaStatus?: FiskistofaQuotaStatus | null
}
