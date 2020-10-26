import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CommunicationResponse {
  @Field(() => Boolean)
  sent: boolean
}
