import { Field, ObjectType, ID, createUnionType } from '@nestjs/graphql'

import {
  IArticle,
  IArticleCategory,
  ILifeEventPage,
  INews,
  IUrl,
} from '../generated/contentfulTypes'

import { News } from './news.model'
import { Article } from './article.model'
import { LifeEventPage } from './lifeEventPage.model'
import { ArticleCategory } from './articleCategory.model'

type UrlPageTypes = IArticle | IArticleCategory | INews | ILifeEventPage

export const mapPage = ({ fields, sys }: UrlPageTypes) => ({
  id: sys.id,
  contentType: sys.contentType.sys.id,
  title: fields.title,
  slug: fields.slug,
})

export const UrlPage = createUnionType({
  name: 'UrlPage',
  types: () => [Article, ArticleCategory, News, LifeEventPage],
  resolveType: (value) => {
    switch (value.contentType) {
      case 'lifeEventPage':
        return LifeEventPage
      case 'news':
        return News
      case 'article':
        return Article
      case 'articleCategory':
        return ArticleCategory
      default:
        break
    }
  },
})

@ObjectType()
export class Url {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  title?: string

  @Field(() => UrlPage)
  page: typeof UrlPage

  @Field(() => [String])
  urlsList: Array<string>
}

export const mapUrl = ({ fields, sys }: IUrl): Url => ({
  id: sys.id,
  title: fields.title ?? '',
  page: mapPage(fields.page),
  urlsList: fields.urlsList,
})
