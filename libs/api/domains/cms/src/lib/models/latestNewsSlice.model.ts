import { Field, ID, ObjectType } from '@nestjs/graphql'
import { GetNewsInput } from '../dto/getNews.input'

import { ILatestNewsSlice } from '../generated/contentfulTypes'

import { News } from './news.model'

@ObjectType()
export class LatestNewsSlice {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [News])
  news: GetNewsInput
}

export const mapLatestNewsSlice = ({
  fields,
  sys,
}: ILatestNewsSlice): LatestNewsSlice => ({
  typename: 'LatestNewsSlice',
  id: sys.id,
  title: fields.title ?? '',
  news: { lang: sys.locale === 'is-IS' ? 'is' : sys.locale, size: 3 },
})
