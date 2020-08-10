import { Field, ID, ObjectType } from '@nestjs/graphql'
import { News } from '../news.model'

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
