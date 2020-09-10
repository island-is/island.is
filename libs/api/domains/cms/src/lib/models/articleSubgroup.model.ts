import { Field, ObjectType } from '@nestjs/graphql'

import { IArticleSubgroup } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleSubgroup {
  @Field()
  title: string

  @Field()
  slug: string
}

export const mapArticleSubgroup = ({
  fields,
}: IArticleSubgroup): ArticleSubgroup => ({
  title: fields.title,
  slug: fields.slug,
})
