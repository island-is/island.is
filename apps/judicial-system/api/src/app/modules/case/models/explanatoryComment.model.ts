import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CommentType } from '@island.is/judicial-system/types'

registerEnumType(CommentType, { name: 'CommentType' })

@ObjectType()
export class ExplanatoryComment {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly modified?: string

  @Field({ nullable: true })
  readonly caseId?: string

  @Field(() => CommentType, { nullable: true })
  readonly commentType?: CommentType

  @Field({ nullable: true })
  readonly comment?: string
}
