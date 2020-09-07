import { Field, ObjectType } from '@nestjs/graphql'
import { Image } from './image.model'
import jsonContentType from 'graphql-type-json'
import { Document } from '@contentful/rich-text-types'

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
