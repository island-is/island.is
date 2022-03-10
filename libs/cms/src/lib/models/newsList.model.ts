import { Field, Int, ObjectType } from '@nestjs/graphql'
import { News } from './news.model'

@ObjectType()
export class NewsList {
  @Field(() => Int)
  total!: number

  @Field(() => [News])
  items!: News[]
}
