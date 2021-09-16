import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as types from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { Html, mapHtml } from './html.model'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'

@ObjectType()
export class AboutSubPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  url!: string

  @Field()
  description?: string

  @Field()
  subDescription?: string

  @Field(() => Html, { nullable: true })
  intro?: Html | null

  @Field(() => [SliceUnion])
  slices: Array<typeof SliceUnion> = []

  @Field(() => [SliceUnion])
  bottomSlices: Array<typeof SliceUnion | null> = [] // safelyMapSliceUnion can return null

  @Field(() => String, { nullable: true })
  parent?: null
}

export const mapAboutSubPage = ({
  fields,
  sys,
}: types.IAboutSubPage): SystemMetadata<AboutSubPage> => ({
  typename: 'AboutSubPage',
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  url: fields.url ?? '',
  description: fields.description ?? '',
  subDescription: fields.subDescription ?? '',
  intro: (fields.intro && mapHtml(fields.intro, sys.id + ':intro')) ?? null,
  slices: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  bottomSlices: (fields.belowContent ?? [])
    .map(safelyMapSliceUnion)
    .filter(Boolean),
  parent: null,
})
