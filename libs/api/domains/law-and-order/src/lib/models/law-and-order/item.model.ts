import { Field, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'

@ObjectType('LawAndOrderSubpoenaItem')
export class Item {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  link?: string

  @Field(() => Action, { nullable: true })
  action?: Action
}
