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
    description: 'National id of the organization this conversation is with.',
  })
  organizationNationalId?: string

  @Field({ nullable: true, description: 'Display name of the organization.' })
  organizationName?: string

  @Field({
    nullable: true,
    description:
      'Name of the department within the organization, when the resolved mapping row is group-specific.',
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
