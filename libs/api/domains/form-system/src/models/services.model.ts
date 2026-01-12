import { Field, ObjectType } from '@nestjs/graphql'
import { ListItem } from './listItem.model'

@ObjectType('FormSystemList')
export class List {
  @Field(() => String, { nullable: true })
  listType?: string

  @Field(() => [ListItem], { nullable: 'itemsAndList' })
  list?: ListItem[]
}
