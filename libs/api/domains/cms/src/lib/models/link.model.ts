import { Field, ObjectType, ID, createUnionType } from '@nestjs/graphql'
import { Entry } from 'contentful'

import {
  IArticle,
  IArticleCategory,
  ILink,
  INews,
  ILinkFields,
} from '../generated/contentfulTypes'

import { Article, mapArticle } from './article.model'
import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { mapNews, News } from './news.model'

export interface IPageLinkFields {
  title: string
  slug: string
}

export interface IPageLink extends Entry<IPageLinkFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'link'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

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
export class Link {
  @Field(() => ID)
  id: string

  @Field()
  text: string

  @Field()
  url: string

  @Field(() => Page, { nullable: true })
  page?: Page
}

export const mapLink = ({ fields, sys }: ILink): Link => ({
  id: sys.id,
  text: fields.text,
  url: fields.url,
  page: fields.page ? mapPage(fields.page) : null,
})
