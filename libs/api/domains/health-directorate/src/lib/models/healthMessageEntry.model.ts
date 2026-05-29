import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { HealthMessageDirectionEnum } from './enums'
import { HealthDirectorateHealthMessageAttachment } from './healthMessageAttachment.model'

@ObjectType()
export class HealthDirectorateHealthMessageEntry {
  @Field(() => ID)
  id!: string

  @Field(() => HealthMessageDirectionEnum, {
    description: 'Author of the message: PATIENT, STAFF, or SYSTEM.',
  })
  direction!: HealthMessageDirectionEnum

  @Field(() => GraphQLISODateTime)
  messageSentAt!: Date

  @Field({ nullable: true })
  messageTextContent?: string

  @Field({ nullable: true })
  senderGroupName?: string

  @Field(() => [HealthDirectorateHealthMessageAttachment])
  attachments!: HealthDirectorateHealthMessageAttachment[]
}
