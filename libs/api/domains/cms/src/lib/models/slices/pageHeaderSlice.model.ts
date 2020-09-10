import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Link, mapLink } from '../link.model'
import { Slice, mapSlice } from './slice.model'
import { IPageHeader } from '../../generated/contentfulTypes'

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

  @Field(() => [Slice])
  slices: Array<typeof Slice>
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
    slices: fields.slices.map(mapSlice),
  })
