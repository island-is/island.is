import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'
import { Action } from './action.model'

@ObjectType('EstatesProgressStep')
export class ProgressStep {
  @Field(() => Int, { nullable: true })
  order?: number

  @Field({ nullable: true, description: 'Step code from the API' })
  code?: string

  @Field({ nullable: true, description: 'Step state from the API' })
  state?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  completedDate?: Date

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  information?: string

  @Field(() => Action, { nullable: true })
  action?: Action
}
