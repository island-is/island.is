import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import type { SystemMetadata } from '@island.is/shared/types'
import type { ILifeEventPageListSlice } from '../generated/contentfulTypes'
import { LifeEventPage, mapLifeEventPage } from './lifeEventPage.model'
import { getArrayOrEmptyArrayFallback } from './utils'

@ObjectType()
export class LifeEventPageListSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [LifeEventPage])
  lifeEventPageList!: LifeEventPage[]
}

export const mapLifeEventPageListSlice = ({
  fields,
  sys,
}: ILifeEventPageListSlice): SystemMetadata<LifeEventPageListSlice> => ({
  typename: 'LifeEventPageListSlice',
  id: sys.id,
  title: fields.title ?? '',
  lifeEventPageList: getArrayOrEmptyArrayFallback(fields.lifeEventPageList).map(
    mapLifeEventPage,
  ),
})
