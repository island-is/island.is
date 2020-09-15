import { Field, ObjectType } from '@nestjs/graphql'

import { IArticleCategory } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleCategory {
  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string
}

export const mapArticleCategory = ({
  fields,
}: IArticleCategory): ArticleCategory => ({
  title: fields.title,
  slug: fields.slug,
  description: fields.description ?? '',
})
