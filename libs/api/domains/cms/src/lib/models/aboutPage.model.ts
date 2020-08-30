import { Field, ObjectType } from '@nestjs/graphql'
import { Slice, mapSlice } from './slices/slice.model'
import * as types from '../generated/contentfulTypes'

@ObjectType()
export class AboutPage {
  @Field()
  title: string

  @Field()
  seoDescription: string

  @Field()
  theme: string

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}

export const mapAboutPage = ({ fields }: types.IPage): AboutPage => ({
  slices: fields.slices.map(mapSlice),
  title: fields.title,
  theme: fields.theme.toLowerCase(),
  seoDescription: fields.seoDescription ?? '',
})
