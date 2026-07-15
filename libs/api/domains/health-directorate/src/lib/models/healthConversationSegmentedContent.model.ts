import { Field, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateHealthConversationSegment } from './healthConversationSegment.model'

@ObjectType()
export class HealthDirectorateHealthConversationSegmentedContent {
  @Field(() => [HealthDirectorateHealthConversationSegment], {
    description: 'Ordered text/link segments.',
  })
  segments!: HealthDirectorateHealthConversationSegment[]
}
