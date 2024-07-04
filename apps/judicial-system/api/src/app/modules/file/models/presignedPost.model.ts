import graphqlTypeJson from 'graphql-type-json'

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PresignedPost {
  @Field(() => String)
  readonly url!: string

  @Field(() => graphqlTypeJson)
  readonly fields!: { [key: string]: string }

  @Field(() => String)
  readonly key!: string
}
