import { Field, ID, ObjectType } from '@nestjs/graphql'
import jsonContentType from 'graphql-type-json'
import { Document } from '@contentful/rich-text-types'

import { ILifeEventPage } from '../generated/contentfulTypes'

import { Image, mapImage } from './image.model'

@ObjectType()
export class LifeEventPage {
  @Field(() => ID)
  id: string

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

  @Field(() => jsonContentType)
  body: Document
}

export const mapLifeEventPage = ({
  fields,
  sys
}: ILifeEventPage): LifeEventPage => ({
  id: sys.id,
  title: fields.title,
  slug: fields.slug,
  intro: fields.intro,
  image: mapImage(fields.image),
  thumbnail: fields.thumbnail && mapImage(fields.thumbnail),
  body: fields.content,
})
