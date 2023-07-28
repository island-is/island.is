import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { ISubpageHeader } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Image, mapImage } from './image.model'

@ObjectType()
export class SubpageHeader {
  @Field()
  subpageId!: string

  @Field()
  title!: string

  @Field()
  summary!: string

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null

  @CacheField(() => [SliceUnion], { nullable: true })
  body?: Array<typeof SliceUnion>
}

export const mapSubpageHeader = ({
  fields,
}: ISubpageHeader): SubpageHeader => ({
  subpageId: fields.subpageId ?? '',
  title: fields.title ?? '',
  summary: fields.summary ?? '',
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  body: fields.body ? mapDocument(fields.body, fields.subpageId + ':body') : [],
})
