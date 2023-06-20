import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { News } from './news.model'

@ObjectType()
export class NewsList {
  @Field(() => Int)
  total!: number

  @CacheField(() => [News])
  items!: News[]
}
