import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationVideoContent {
  @Field({ description: 'Video-call join link.' })
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
