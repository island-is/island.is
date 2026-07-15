import { Field, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateHealthConversationSegment } from './healthConversationSegment.model'

@ObjectType()
export class HealthDirectorateHealthConversationSegmentedContent {
  // No @Field() — never exposed in the schema. Set by the mapper so the
  // union's resolveType can read the variant instead of inspecting shape.
  typename?: string

  @Field(() => [HealthDirectorateHealthConversationSegment], {
    description: 'Ordered text/link segments.',
  })
  segments!: HealthDirectorateHealthConversationSegment[]
}
