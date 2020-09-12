import { Field, ObjectType } from '@nestjs/graphql'

import { ISubArticle } from '../generated/contentfulTypes'

import { Slice, mapDocument } from './slice.model'

@ObjectType()
export class SubArticle {
  @Field()
  title: string

  @Field()
  slug: string

  @Field(() => [Slice])
  body: Array<typeof Slice>
}

export const mapSubArticle = ({ fields }: ISubArticle): SubArticle => ({
  title: fields.title,
  slug: fields.slug,
  body: mapDocument(fields.content)
})
