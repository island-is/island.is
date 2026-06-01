import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationAttachment {
  @Field(() => Int)
  id!: number

  @Field()
  fileName!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  downloadServiceURL!: string
}
