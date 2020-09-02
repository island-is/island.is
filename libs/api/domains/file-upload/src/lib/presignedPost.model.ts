import { Field, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class PresignedPost {
  @Field(() => String)
  url: string

  @Field(() => graphqlTypeJson)
  fields: object
}
