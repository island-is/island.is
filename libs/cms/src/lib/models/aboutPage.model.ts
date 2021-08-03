import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as types from '../generated/contentfulTypes'
import { PageHeader, mapPageHeader } from './pageHeader.model'
import { safelyMapSliceUnion, SliceUnion } from '../unions/slice.union'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class AboutPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  seoDescription?: string

  @Field()
  theme?: string

  @Field(() => PageHeader)
  pageHeader!: PageHeader

  @Field(() => [SliceUnion])
  slices!: Array<typeof SliceUnion>
}

export const mapAboutPage = ({
  fields,
  sys,
}: types.IPage): SystemMetadata<AboutPage> => ({
  typename: 'AboutPage',
  id: sys.id,
  pageHeader: mapPageHeader(fields.header),
  slices: fields.slices
    ?.map(safelyMapSliceUnion)
    .filter((slice): slice is typeof SliceUnion => Boolean(slice)), // filter out empty slices that failed mapping
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  theme: fields.theme ?? '',
  seoDescription: fields.seoDescription ?? '',
})
