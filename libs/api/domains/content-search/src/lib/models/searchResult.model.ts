import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'

import { Article } from 'libs/api/domains/cms/src/lib/models/article.model'
import { LifeEventPage } from 'libs/api/domains/cms/src/lib/models/lifeEventPage.model'

const Items = createUnionType({
  name: 'Items',
  types: () => [Article, LifeEventPage],
  resolveType: (document) => {
    if (document.image) {
      return LifeEventPage
    }

    return Article
  },
})

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total: number

  @Field(() => [Items])
  items: Array<typeof Items>
}
