import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ContentItem } from './contentItem.model'

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total: number

  @Field(() => [ContentItem])
  items: ContentItem[]
}
