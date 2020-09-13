import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ContentItem } from './contentItem.model'

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total: number

  // TODO: Change this to slices of all indexed types
  @Field(() => [ContentItem])
  items: ContentItem[]
}
