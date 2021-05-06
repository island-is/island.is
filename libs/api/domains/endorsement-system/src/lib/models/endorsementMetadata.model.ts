import { Field, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class EndorsementMetadata {
  @Field({ nullable: true })
  fullName!: string | null

  @Field(() => graphqlTypeJson, { nullable: true })
  address!: object | null
}
