import { ObjectType, Field } from '@nestjs/graphql'
import { TherapySession } from './therapySession.model'

@ObjectType('RightsPortalTherapyPeriod')
export class TherapyPeriod {
  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => TherapySession, { nullable: true })
  sessions?: TherapySession

  @Field(() => Date, { nullable: true })
  to?: Date
}
