import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'
import {
  AboutPage,
  Article,
  LifeEventPage,
  News,
} from '@island.is/api/domains/cms'

const types = {
  webArticle: Article,
  webLifeEventPage: LifeEventPage,
  webNews: News,
  webAboutPage: AboutPage,
}

const Items = createUnionType({
  name: 'Items',
  types: () => Object.values(types),
  resolveType: (document) => types[document.__typename], // __typename is appended to request on indexing
})

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total: number

  @Field(() => [Items])
  items: Array<typeof Items>
}

// TODO: Classes form multiple classes can conflict here, look into adding namespace prefixes to classes
