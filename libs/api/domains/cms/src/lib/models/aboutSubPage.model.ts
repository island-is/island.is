import { SearchIndexes } from '@island.is/content-search-indexer/types'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as types from '../generated/contentfulTypes'
import { AboutPage } from './aboutPage.model'
import { Slice, mapDocument, safelyMapSlices } from './slice.model'

@ObjectType()
export class AboutSubPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  url: string

  @Field()
  description: string

  @Field()
  subDescription: string

  @Field(() => [Slice])
  slices: Array<typeof Slice>

  @Field(() => [Slice])
  bottomSlices: Array<typeof Slice>

  @Field(() => AboutPage, { nullable: true })
  parent?: { lang: keyof typeof SearchIndexes; id: string }
}

export const mapAboutSubPage = ({
  fields,
  sys,
}: types.IAboutSubPage): AboutSubPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  url: fields.url ?? '',
  description: fields.description ?? '',
  subDescription: fields.subDescription ?? '',
  slices: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  bottomSlices: (fields.belowContent ?? [])
    .map(safelyMapSlices)
    .filter(Boolean),
  parent: fields.parent
    ? {
        lang:
          sys.locale === 'is-IS'
            ? 'is'
            : (sys.locale as keyof typeof SearchIndexes),
        id: fields.parent.sys.id,
      }
    : null,
})
