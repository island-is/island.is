import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'
import {
  AboutPage,
  Article,
  LifeEventPage,
  News,
} from '@island.is/api/domains/cms'
import { TagCount } from './tagCount'

const Items = createUnionType({
  name: 'Items',
  types: () => [Article, LifeEventPage, News, AboutPage],
  resolveType: (document) => document.typename, // typename is appended to request on mapping
})

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total: number

  @Field(() => [Items])
  items: Array<typeof Items>

  @Field(() => [TagCount], { nullable: true })
  tagCounts?: TagCount[]
}

// TODO: Classes form multiple domains can conflict here, look into adding namespace prefixes to classes
