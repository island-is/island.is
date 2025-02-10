import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { Grant } from './grant.model'

@ObjectType()
export class GrantList {
  @Field(() => Int)
  total!: number

  @CacheField(() => [Grant])
  items!: Grant[]
}
