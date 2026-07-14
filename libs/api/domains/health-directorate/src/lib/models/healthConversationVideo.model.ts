import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationVideo {
  @Field({ description: 'Video-call join link. Carries a pin query param.' })
  url!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  appointmentDate?: Date

  @Field({ nullable: true })
  appointmentHostName?: string

  @Field()
  isCanceled!: boolean

  @Field()
  isEdited!: boolean
}
