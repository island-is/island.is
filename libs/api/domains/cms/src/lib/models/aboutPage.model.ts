import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as types from '../generated/contentfulTypes'
import { Slice, safelyMapSlices } from './slice.model'
import { PageHeader, mapPageHeader } from './pageHeader.model'

@ObjectType()
export class AboutPage {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  seoDescription: string

  @Field()
  theme: string

  @Field(() => PageHeader)
  pageHeader: PageHeader

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}

export const mapAboutPage = ({ fields, sys }: types.IPage): AboutPage => ({
  typename: 'AboutPage',
  id: sys.id,
  pageHeader: mapPageHeader(fields.header),
  slices: fields.slices?.map(safelyMapSlices).filter((slice): slice is typeof Slice => Boolean(slice)), // filter out empty slices that failed mapping
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  theme: fields.theme ?? '',
  seoDescription: fields.seoDescription ?? '',
})
