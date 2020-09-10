import { Field, ObjectType } from '@nestjs/graphql'

import { IArticleGroup } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleGroup {
  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  sortBy?: string
}

export const mapArticleGroup = ({ fields }: IArticleGroup): ArticleGroup => ({
  title: fields.title,
  slug: fields.slug,
  description: fields.description ?? '',
  sortBy: fields.sortBy ?? '',
})
