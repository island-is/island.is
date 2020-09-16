import { Field, ObjectType, Int } from '@nestjs/graphql'

import { IArticleSubgroup } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleSubgroup {
  @Field()
  title: string

  @Field()
  slug: string

  @Field(() => Int, { nullable: true })
  importance?: number
}

export const mapArticleSubgroup = ({
  fields,
}: IArticleSubgroup): ArticleSubgroup => ({
  title: fields.title,
  slug: fields.slug,
  importance: fields?.importance ?? 0,
})
