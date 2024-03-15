import graphqlTypeJson from 'graphql-type-json'

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PresignedPost {
  @Field()
  readonly url!: string

  @Field(() => graphqlTypeJson)
  readonly fields!: { [key: string]: string }
}
