import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IPageHeader, ITimeline } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { TimelineSlice, mapTimelineSlice } from './timelineSlice.model'
import { getArrayOrEmptyArrayFallback } from './utils'

@ObjectType()
export class PageHeader {
  @Field()
  typename!: string

  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  introduction?: string

  @Field()
  navigationText!: string

  @CacheField(() => [Link])
  links?: Link[]

  @CacheField(() => [TimelineSlice])
  slices!: Array<TimelineSlice>
}

export const mapPageHeader = (entry: IPageHeader): PageHeader => {
  const fields = entry?.fields
  const sys = entry?.sys
  return {
    typename: 'PageHeader',
    id: sys.id,
    title: fields.title ?? '',
    introduction: fields.introduction ?? '',
    navigationText: fields.navigationText ?? '',
    links: getArrayOrEmptyArrayFallback(fields.links).map(mapLink),
    slices: getArrayOrEmptyArrayFallback(fields.slices)
      .filter(
        (entry): entry is ITimeline =>
          entry.sys.contentType.sys.id === 'timeline',
      )
      .map((slice) => mapTimelineSlice(slice)),
  }
}
