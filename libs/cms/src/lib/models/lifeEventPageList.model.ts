import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { LifeEventPage } from './lifeEventPage.model'
import { AnchorPage } from './anchorPage.model'

@ObjectType()
export class LifeEventPageListSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [LifeEventPage], { nullable: true })
  lifeEventPageList?: LifeEventPage[] | AnchorPage[]
}
