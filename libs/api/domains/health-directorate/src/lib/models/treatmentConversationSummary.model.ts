import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateTreatmentConversationSummary {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastMessageSentAt?: Date

  @Field({
    nullable: true,
    description:
      'Name of the care-team group that last wrote, not a named clinician.',
  })
  senderName?: string
}
