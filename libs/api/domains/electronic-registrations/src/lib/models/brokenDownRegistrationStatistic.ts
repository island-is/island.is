import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class RegistrationTypeStatistic {
  @Field()
  registrationType?: string | null

  @Field()
  totalRegistrationsOfType?: number

  @Field()
  totalPaperRegistrationsOfType?: number

  @Field()
  totalElectronicRegistrationsOfType?: number
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
  totalElectronicRegistrationsForCurrentPeriodInterval?: number

  @Field(() => [RegistrationTypeStatistic])
  registrationTypes?: RegistrationTypeStatistic[]
}
