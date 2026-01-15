import { Field, ObjectType } from '@nestjs/graphql'
import { Item } from './item.model'

@ObjectType('LawAndOrderGroup')
export class Group {
  @Field({ nullable: true })
  label?: string

  @Field(() => [Item], { nullable: true })
  items?: Array<Item>
}
