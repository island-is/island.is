import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GetListItemsInput } from '../dto/getListItems.input'
import { ListItem } from './listItem.model'

@ObjectType()
export class ListItemResponse {
  @CacheField(() => GetListItemsInput)
  input!: GetListItemsInput

  @CacheField(() => [ListItem])
  items!: ListItem[]

  @Field(() => Int)
  total!: number
}
