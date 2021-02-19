import { Field, ObjectType } from '@nestjs/graphql'

import { ILinkedPage } from '../generated/contentfulTypes'

import { Article } from './article.model'
import { ArticleCategory } from './articleCategory.model'
import { News } from './news.model'
import { Page } from './page.model'

@ObjectType()
export class LinkedPage {
  @Field()
  title: string

  @Field(() => Article)
  page: Article
}

export const mapLinkedPage = ({ fields }: ILinkedPage): LinkedPage => ({
  title: fields.title,
  page: fields.page?.fields,
})
