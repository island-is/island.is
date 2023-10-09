import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class RegistrationTypeStatistic {
  @Field()
  registrationType?: string

  @Field()
  totalRegistrationsOfType?: number

  @Field()
  totalPaperRegistrationsOfType?: number

  @Field()
  totalElectronicRegistrationsOfType?: number

  @Field()
  totalManualRegistrationsOfType?: number
}

@ObjectType()
export class BrokenDownRegistrationStatistic {
  @Field()
  periodIntervalName?: string

  @Field()
  totalRegistrationForCurrentPeriodInterval?: number

  @Field()
  totalPaperRegistrationsForCurrentPeriodInterval?: number

  @Field()
  totalManualRegistrationsForCurrentPeriodInterval?: number

  @Field()
  totalElectronicRegistrationsForCurrentPeriodInterval?: number

  @CacheField(() => [RegistrationTypeStatistic])
  registrationTypes?: RegistrationTypeStatistic[]
}

@ObjectType()
export class BrokenDownRegistrationStatisticResponse {
  @CacheField(() => [BrokenDownRegistrationStatistic], { nullable: true })
  electronicRegistrationStatisticBreakdown?: BrokenDownRegistrationStatistic[]
}
