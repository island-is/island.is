import { Field, ObjectType } from '@nestjs/graphql'

import { ISubpageHeader } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
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

  @Field(() => [SliceUnion], { nullable: true })
  body?: Array<typeof SliceUnion>
}

export const mapSubpageHeader = ({
  fields,
}: ISubpageHeader): SubpageHeader => ({
  subpageId: fields.subpageId ?? '',
  title: fields.title ?? '',
  summary: fields.summary ?? '',
  featuredImage: mapImage(fields.featuredImage),
  body: fields.body ? mapDocument(fields.body, fields.subpageId + ':body') : [],
})
