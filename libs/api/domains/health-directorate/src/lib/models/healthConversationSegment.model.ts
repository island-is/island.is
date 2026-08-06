import { Field, ObjectType } from '@nestjs/graphql'
import { HealthConversationSegmentTypeEnum } from './enums'

@ObjectType()
export class HealthDirectorateHealthConversationSegment {
  @Field(() => HealthConversationSegmentTypeEnum, {
    description: 'Segment kind. TEXT carries text; LINK carries label + href.',
  })
  type!: HealthConversationSegmentTypeEnum

  @Field({ nullable: true, description: 'Set on text segments.' })
  text?: string

  @Field({ nullable: true, description: 'Anchor text; set on link segments.' })
  label?: string

  @Field({
    nullable: true,
    description: 'Sanitized https href; set on link segments.',
  })
  href?: string
}
