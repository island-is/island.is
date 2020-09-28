import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as types from '../generated/contentfulTypes'
import { Slice, mapDocument } from './slice.model'

@ObjectType()
export class AboutSubPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  description: string

  @Field()
  subDescription: string

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}

export const mapAboutSubPage = ({
  fields,
  sys,
}: types.IAboutSubPage): AboutSubPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  description: fields.description ?? '',
  subDescription: fields.subDescription ?? '',
  slices: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
})
