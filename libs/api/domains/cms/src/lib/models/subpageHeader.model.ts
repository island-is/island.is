import { Field, ObjectType } from '@nestjs/graphql'

import { ISubpageHeader } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class SubpageHeader {
  @Field()
  subpageId: string

  @Field()
  title: string

  @Field()
  summary: string

  @Field(() => Image, { nullable: true })
  featuredImage?: Image

  @Field({ nullable: true })
  content?: string
}

export const mapSubpageHeader = ({
  fields,
}: ISubpageHeader): SubpageHeader => ({
  subpageId: fields.subpageId ?? '',
  title: fields.title ?? '',
  summary: fields.summary ?? '',
  featuredImage: mapImage(fields.featuredImage),
  content: fields.content ? JSON.stringify(fields.content) : '',
})
