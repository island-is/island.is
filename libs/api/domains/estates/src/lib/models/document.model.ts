import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'
import { Action } from './action.model'

@ObjectType('EstatesDocument')
export class EstateDocument {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  documentTypeDescription?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  documentDate?: Date

  @Field({ nullable: true })
  availability?: string

  @Field({ nullable: true })
  islandIsDocumentId?: string

  @Field(() => Action, { nullable: true })
  requestAction?: Action
}
