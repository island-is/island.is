/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IVidspyrnaFrontpage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import {
  AdgerdirSliceUnion,
  mapAdgerdirSliceUnion,
} from '../unions/adgerdirSlice.union'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class AdgerdirFrontpage {
  @Field(() => ID)
  id!: string

  @Field()
  slug!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [SliceUnion])
  content?: Array<typeof SliceUnion>

  @Field(() => [AdgerdirSliceUnion])
  slices!: Array<typeof AdgerdirSliceUnion>

  @Field(() => Image, { nullable: true })
  featuredImage?: Image | null
}

export const mapAdgerdirFrontpage = ({
  sys,
  fields,
}: IVidspyrnaFrontpage): SystemMetadata<AdgerdirFrontpage> => ({
  typename: 'AdgerdirFrontpage',
  id: sys?.id ?? '',
  slug: fields?.slug ?? '',
  title: fields?.title ?? '',
  description: fields?.description ?? '',
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  content:
    sys?.id && fields?.content
      ? mapDocument(fields.content, sys?.id + ':content')
      : [],
  slices: fields?.slices
    ? fields.slices
        .filter((x) => x.sys?.contentType?.sys?.id)
        .map(mapAdgerdirSliceUnion)
    : [],
})
