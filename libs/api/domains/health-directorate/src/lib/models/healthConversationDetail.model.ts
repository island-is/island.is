import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateHealthConversation } from './healthConversation.model'
import { HealthDirectorateHealthConversationEntry } from './healthConversationEntry.model'

@ObjectType()
export class HealthDirectorateHealthConversationDetail extends HealthDirectorateHealthConversation {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field({
    nullable: true,
    description:
      'Whether the patient can reply. Null means no staff decision yet — replies are allowed unless explicitly false.',
  })
  patientCanReply?: boolean

  @Field(() => [HealthDirectorateHealthConversationEntry])
  messages!: HealthDirectorateHealthConversationEntry[]
}
