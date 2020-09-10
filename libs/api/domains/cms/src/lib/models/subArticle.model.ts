import { Field, ObjectType } from '@nestjs/graphql'

import { ISubArticle } from '../generated/contentfulTypes'

@ObjectType()
export class SubArticle {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  content: string
}

export const mapSubArticle = ({ fields }: ISubArticle): SubArticle => ({
  title: fields.title,
  slug: fields.slug,
  content: JSON.stringify(fields.content),
})
