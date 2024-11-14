import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EventLogResponse {
  @Field(() => Boolean)
  success!: boolean
}
