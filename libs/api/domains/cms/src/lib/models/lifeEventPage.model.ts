import { Field, ObjectType } from '@nestjs/graphql'

import { ILifeEventPage } from '../generated/contentfulTypes'

import { Slice, mapDocument } from './slice.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class LifeEventPage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  intro: string

  @Field()
  image: Image

  @Field({ nullable: true })
  thumbnail?: Image

  @Field(() => [Slice])
  content: Array<typeof Slice>
}

export const mapLifeEventPage = ({
  fields,
}: ILifeEventPage): LifeEventPage => ({
  title: fields.title,
  slug: fields.slug,
  intro: fields.intro,
  image: mapImage(fields.image),
  thumbnail: fields.thumbnail && mapImage(fields.thumbnail),
  content: mapDocument(fields.content),
})
