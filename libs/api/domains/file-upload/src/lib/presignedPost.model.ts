import { Field, Int, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class PresignedPost {
  @Field((type) => String)
  url: string

  @Field((type) => graphqlTypeJson)
  fields: object
}
