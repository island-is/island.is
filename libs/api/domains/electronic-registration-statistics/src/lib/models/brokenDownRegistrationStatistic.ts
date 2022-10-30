import { Field, ObjectType } from '@nestjs/graphql'

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

  @Field(() => [RegistrationTypeStatistic])
  registrationTypes?: RegistrationTypeStatistic[]
}

@ObjectType()
export class BrokenDownRegistrationStatisticResponse {
  @Field(() => [BrokenDownRegistrationStatistic], { nullable: true })
  electronicRegistrationStatisticBreakdown?: BrokenDownRegistrationStatistic[]
}
