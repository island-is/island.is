import { Field, ObjectType } from '@nestjs/graphql'
import jsonContentType from 'graphql-type-json'
import { Document } from '@contentful/rich-text-types'

import { ILifeEventPage } from '../generated/contentfulTypes'

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

  @Field(() => jsonContentType)
  body: Document
}

export const mapLifeEventPage = ({
  fields,
}: ILifeEventPage): LifeEventPage => ({
  title: fields.title,
  slug: fields.slug,
  intro: fields.intro,
  image: mapImage(fields.image),
  body: fields.content,
})
