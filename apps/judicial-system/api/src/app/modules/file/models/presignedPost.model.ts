import { Field, ObjectType } from '@nestjs/graphql'

import { PresignedPost as TPresignedPost } from '@island.is/judicial-system/types'

@ObjectType()
export class PresignedPost implements TPresignedPost {
  @Field()
  readonly url!: string
}
