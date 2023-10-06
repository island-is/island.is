import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalTherapySession')
export class TherapySession {
  @Field(() => Number)
  available!: number

  @Field(() => Number)
  used!: number
}
