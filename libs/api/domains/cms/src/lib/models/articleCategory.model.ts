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

// article group can be undefined we have to handle that there
export const mapArticleCategory = ({
  fields,
}: IArticleCategory): ArticleCategory => ({
  title: fields?.title ?? '',
  slug: fields?.slug ?? '',
  description: fields?.description ?? '',
})
