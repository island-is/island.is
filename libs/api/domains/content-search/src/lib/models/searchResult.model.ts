import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ContentItem } from './contentItem.model';

@ObjectType()
export class SearchResult {
  @Field(type => Int)
  total: number

  @Field((type) => [ContentItem])
  items: ContentItem[]
}
