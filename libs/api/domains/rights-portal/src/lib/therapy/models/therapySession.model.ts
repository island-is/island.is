import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('RightsPortalTherapySession')
export class TherapySession {
  @Field(() => Int)
  available!: number

  @Field(() => Int)
  used!: number
}
