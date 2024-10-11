import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GetGenericListItemsInput } from '../dto/getGenericListItems.input'
import { GenericListItem } from './genericListItem.model'

@ObjectType()
export class GenericListItemResponse {
  @CacheField(() => GetGenericListItemsInput)
  input!: GetGenericListItemsInput

  @CacheField(() => [GenericListItem])
  items!: GenericListItem[]

  @Field(() => Int)
  total!: number
}
