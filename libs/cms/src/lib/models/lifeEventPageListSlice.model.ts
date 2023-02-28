import { Field, ObjectType, ID } from '@nestjs/graphql'
import type { SystemMetadata } from '@island.is/shared/types'
import type { ILifeEventPageListSlice } from '../generated/contentfulTypes'
import { LifeEventPage, mapLifeEventPage } from './lifeEventPage.model'

@ObjectType()
export class LifeEventPageListSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => [LifeEventPage])
  lifeEventPageList!: LifeEventPage[]
}

export const mapLifeEventPageListSlice = ({
  fields,
  sys,
}: ILifeEventPageListSlice): SystemMetadata<LifeEventPageListSlice> => ({
  typename: 'LifeEventPageListSlice',
  id: sys.id,
  title: fields.title ?? '',
  lifeEventPageList: fields.lifeEventPageList
    ? fields.lifeEventPageList.map(mapLifeEventPage)
    : [],
})
