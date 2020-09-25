import { Field, ObjectType, createUnionType } from '@nestjs/graphql'

import {
  IArticle,
  IArticleCategory,
  INews,
  ILinkedPage,
} from '../generated/contentfulTypes'

import { Article } from './article.model'
import { ArticleCategory } from './articleCategory.model'
import { News } from './news.model'

@ObjectType()
export class Page {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  type: string
}

export const PageTypes = createUnionType({
  name: 'PageTypes',
  types: () => [Article, ArticleCategory, News],
  resolveType: () => Page,
})

export const mapPage = (page: IArticle | INews | IArticleCategory): Page => {
  return {
    title: page.fields.title,
    slug: page.fields.slug,
    type: page.sys.contentType.sys.id,
  }
}

@ObjectType()
export class LinkedPage {
  @Field()
  title: string

  @Field(() => Page, { nullable: true })
  page?: Page
}

export const mapLinkedPage = ({ fields }: ILinkedPage): LinkedPage => ({
  title: fields.title,
  page: fields.page ? mapPage(fields.page) : null,
})
