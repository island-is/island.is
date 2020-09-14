import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IPageHeader } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { TimelineSlice, mapTimelineSlice } from './timelineSlice.model'

@ObjectType()
export class PageHeaderSlice {
  constructor(initializer: PageHeaderSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  introduction: string

  @Field()
  navigationText: string

  @Field(() => [Link])
  links: Link[]

  @Field(() => [TimelineSlice])
  slices: Array<TimelineSlice>
}

export const mapPageHeaderSlice = ({
  fields,
  sys,
}: IPageHeader): PageHeaderSlice =>
  new PageHeaderSlice({
    id: sys.id,
    title: fields.title,
    introduction: fields.introduction,
    navigationText: fields.navigationText,
    links: fields.links.map(mapLink),
    slices: fields.slices.map(mapTimelineSlice),
  })
