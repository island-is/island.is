import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationAttachment {
  @Field(() => ID)
  id!: string

  @Field()
  fileName!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  downloadServiceURL!: string
}
