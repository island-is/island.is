import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { Tag } from './tag.model'
import type { ProgramTag as TProgramTag } from '@island.is/university-gateway-types'

@ObjectType()
export class ProgramTag implements TProgramTag {
  @Field(() => ID)
  readonly id!: string

  @Field()
  programId!: string

  @Field()
  tagId!: string

  @Field(() => Tag)
  details!: Tag

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
