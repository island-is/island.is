import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import type { SystemMetadata } from '@island.is/shared/types'
import type { IAnchorPageList } from '../generated/contentfulTypes'
import { AnchorPage, mapAnchorPage } from './anchorPage.model'

@ObjectType()
export class AnchorPageListSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [AnchorPage])
  pages!: AnchorPage[]
}

export const mapAnchorPageListSlice = ({
  fields,
  sys,
}: IAnchorPageList): SystemMetadata<AnchorPageListSlice> => {
  const pages = (fields as IAnchorPageList['fields']).pages
  const list = pages ?? []

  return {
    typename: 'AnchorPageListSlice',
    id: sys.id,
    title: fields.title ?? '',
    pages: list.map(mapAnchorPage),
  }
}
