import { Field, ObjectType } from '@nestjs/graphql'

import {
  IArticle,
  IPage,
  IArticleCategory,
  INews,
  ILinkedPage,
} from '../generated/contentfulTypes'

@ObjectType()
export class Page {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  type: string
}

export const mapPage = (
  page: IPage | IArticle | INews | IArticleCategory,
): Page => {
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
