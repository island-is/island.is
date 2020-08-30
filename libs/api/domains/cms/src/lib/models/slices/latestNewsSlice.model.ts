import { Field, ID, ObjectType } from '@nestjs/graphql'
import { News } from '../news.model'
import { ILatestNewsSlice } from '../../generated/contentfulTypes'

@ObjectType()
export class LatestNewsSlice {
  constructor(initializer: LatestNewsSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [News])
  news: News[]
}

export const mapLatestNewsSlice = ({
  fields,
  sys,
}: ILatestNewsSlice): LatestNewsSlice =>
  new LatestNewsSlice({
    id: sys.id,
    title: fields.title ?? '',
    news: [], // populated by resolver
  })
