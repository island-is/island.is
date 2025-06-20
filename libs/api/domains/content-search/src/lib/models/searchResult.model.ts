import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'

import {
  Article,
  AnchorPage,
  LifeEventPage,
  News,
  SubArticle,
  OrganizationSubpage,
  OrganizationPage,
  SupportQNA,
  Link,
  ProjectPage,
  Manual,
  ManualChapterItem,
  OrganizationParentSubpage,
} from '@island.is/cms'

import { TagCount } from './tagCount'
import { TypeCount } from './typeCount'

const Items = createUnionType({
  name: 'Items',
  types: () => [
    Article,
    AnchorPage,
    LifeEventPage,
    News,
    SubArticle,
    OrganizationSubpage,
    OrganizationPage,
    SupportQNA,
    Link,
    ProjectPage,
    Manual,
    ManualChapterItem,
    OrganizationParentSubpage,
  ], // add new return types here
  resolveType: (document) => document.typename, // typename is appended to request on mapping
})

@ObjectType()
export class SearchResult {
  @Field(() => Int)
  total!: number

  @Field(() => [Items])
  items!: Array<typeof Items>

  @Field(() => [TagCount], { nullable: true })
  tagCounts?: TagCount[]

  @Field(() => [TypeCount], { nullable: true })
  typesCount?: TypeCount[]

  @Field(() => Int, { nullable: true })
  processEntryCount?: number
}

// TODO: Classes form multiple domains can conflict here, look into adding namespace prefixes to classes
