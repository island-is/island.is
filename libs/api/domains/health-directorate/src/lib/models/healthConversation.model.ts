import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversation {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  status?: string

  @Field(() => Int)
  messageCount!: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastMessageSentAt?: Date

  @Field({ nullable: true })
  lastSenderGroupName?: string

  @Field({
    nullable: true,
  })
  organizationNationalId?: string

  @Field({ nullable: true })
  organizationName?: string

  @Field({
    nullable: true,
  })
  departmentName?: string

  @Field({ nullable: true })
  organizationLogoUrl?: string

  @Field()
  hasAttachment!: boolean

  @Field()
  isStarred!: boolean

  @Field({
    description: 'True when the patient has archived this message thread.',
  })
  isArchived!: boolean

  @Field({
    description:
      'True when the patient has read the latest message in this thread.',
  })
  isRead!: boolean
}
