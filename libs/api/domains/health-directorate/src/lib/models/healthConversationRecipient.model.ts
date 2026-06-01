import { Field, Int, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateHealthConversationType } from './healthConversationType.model'

@ObjectType()
export class HealthDirectorateHealthConversationRecipient {
  @Field()
  nodeId!: string

  @Field(() => Int)
  groupId!: number

  @Field()
  name!: string

  @Field()
  allowsMessaging!: boolean

  @Field({
    description: 'Effective window open time (HH:mm:ss, UTC).',
  })
  messagingWindowOpen!: string

  @Field({
    description: 'Effective window close time (HH:mm:ss, UTC).',
  })
  messagingWindowClose!: string

  @Field()
  isCurrentlyWithinWindow!: boolean

  @Field(() => Int)
  patientReplyWindowDays!: number

  @Field(() => [HealthDirectorateHealthConversationType])
  allowedMessageTypes!: HealthDirectorateHealthConversationType[]
}
