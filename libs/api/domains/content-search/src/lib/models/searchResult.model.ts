import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'
import { Article, LifeEventPage } from '@island.is/api/domains/cms'

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
