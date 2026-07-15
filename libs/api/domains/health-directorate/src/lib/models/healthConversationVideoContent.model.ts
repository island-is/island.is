import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationVideoContent {
  // No @Field() — never exposed in the schema. Set by the mapper so the
  // union's resolveType can read the variant instead of inspecting shape.
  typename?: string

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
