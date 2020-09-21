import { Field, ID, ObjectType } from '@nestjs/graphql'

import * as types from '../generated/contentfulTypes'

import { Slice, mapSlice } from './slice.model'

@ObjectType()
export class AboutSubPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}

export const mapAboutPage = ({ fields, sys }: types.IAboutSubPage): AboutSubPage => ({
  id: sys.id,
  title: fields.title ?? '',
  description: fields.description ?? '',
  slices: fields.slices.map(mapSlice),
})
