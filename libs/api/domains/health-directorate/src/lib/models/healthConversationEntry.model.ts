import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import {
  HealthConversationDirectionEnum,
  HealthConversationMessageTypeEnum,
} from './enums'
import { HealthDirectorateHealthConversationAttachment } from './healthConversationAttachment.model'
import { HealthDirectorateHealthConversationSegment } from './healthConversationSegment.model'
import { HealthDirectorateHealthConversationVideo } from './healthConversationVideo.model'

@ObjectType()
export class HealthDirectorateHealthConversationEntry {
  @Field(() => ID)
  id!: string

  @Field(() => HealthConversationDirectionEnum, {
    description: 'Author of the message: PATIENT, STAFF, or SYSTEM.',
  })
  direction!: HealthConversationDirectionEnum

  @Field(() => GraphQLISODateTime)
  messageSentAt!: Date

  @Field(() => HealthConversationMessageTypeEnum, {
    description:
      'What kind of message this is. VIDEO: use videoConversation; SEGMENTED: use contentSegments; TEXT: use messageTextContent.',
  })
  messageType!: HealthConversationMessageTypeEnum

  @Field({ nullable: true })
  messageTextContent?: string

  @Field(() => [HealthDirectorateHealthConversationSegment], {
    nullable: true,
    description:
      'Ordered text/link segments. Present when messageType is SEGMENTED.',
  })
  contentSegments?: HealthDirectorateHealthConversationSegment[]

  @Field(() => HealthDirectorateHealthConversationVideo, {
    nullable: true,
    description:
      'Structured video-call card. Present when messageType is VIDEO; messageTextContent is omitted for video messages.',
  })
  videoConversation?: HealthDirectorateHealthConversationVideo

  @Field({ nullable: true })
  senderGroupName?: string

  @Field(() => [HealthDirectorateHealthConversationAttachment])
  attachments!: HealthDirectorateHealthConversationAttachment[]
}
