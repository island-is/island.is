import graphqlTypeJson from 'graphql-type-json'

import { Field, ObjectType } from '@nestjs/graphql'

import type { PresignedPost as TPresignedPost } from '@island.is/judicial-system/types'

@ObjectType()
export class PresignedPost implements TPresignedPost {
  @Field()
  readonly url!: string

  @Field(() => graphqlTypeJson)
  readonly fields!: { [key: string]: string }
}
