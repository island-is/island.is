import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationTextContent {
  @Field()
  text!: string
}
