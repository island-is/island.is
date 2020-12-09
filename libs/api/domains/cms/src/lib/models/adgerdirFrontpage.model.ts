/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import {
  IVidspyrnaFrontpage,
  IVidspyrnaFeaturedNews,
  IVidspyrnaFlokkur,
} from '../generated/contentfulTypes'

import { mapDocument } from './slice.model'
import { mapAdgerdirFeaturedNewsSlice } from './adgerdirFeaturedNewsSlice.model'
import { mapAdgerdirGroupSlice } from './adgerdirGroupSlice.model'
import { Image, mapImage } from './image.model'
import { SliceUnion } from '../unions/slice.union'
import { AdgerdirSliceUnion } from '../unions/adgerdirSlice.union'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class AdgerdirFrontpage {
  @Field(() => ID)
  id: string = ''

  @Field()
  slug: string = ''

  @Field()
  title: string = ''

  @Field({ nullable: true })
  description?: string

  @Field(() => [SliceUnion])
  content: Array<typeof SliceUnion> = []

  @Field(() => [AdgerdirSliceUnion])
  slices: Array<typeof AdgerdirSliceUnion> = []

  @Field(() => Image, { nullable: true })
  featuredImage?: Image
}

type AdgerdirSliceTypes = IVidspyrnaFeaturedNews | IVidspyrnaFlokkur

export const mapAdgerdirSlice = (
  slice: AdgerdirSliceTypes,
): typeof AdgerdirSliceUnion => {
  const id = slice?.sys?.contentType?.sys?.id ?? ''

  switch (id) {
    case 'vidspyrnaFeaturedNews':
      return mapAdgerdirFeaturedNewsSlice(slice as IVidspyrnaFeaturedNews)

    case 'vidspyrnaFlokkur':
      return mapAdgerdirGroupSlice(slice as IVidspyrnaFlokkur)

    default:
      throw new ApolloError(
        `Can not convert to slice in mapAdgerdirFrontpage -> mapAdgerdirSlice`,
      )
  }
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
  featuredImage: mapImage(fields.featuredImage),
  content:
    sys?.id && fields?.content
      ? mapDocument(fields.content, sys?.id + ':content')
      : [],
  slices: fields?.slices
    ? fields.slices
        .filter((x) => x.sys?.contentType?.sys?.id)
        .map(mapAdgerdirSlice)
    : [],
})
