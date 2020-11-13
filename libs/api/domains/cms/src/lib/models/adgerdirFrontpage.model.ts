/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import {
  IVidspyrnaFrontpage,
  IVidspyrnaFeaturedNews,
  IVidspyrnaFlokkur,
} from '../generated/contentfulTypes'

import { Slice, mapDocument } from './slice.model'
import { AdgerdirSlice } from './adgerdirSlice.model'
import { mapAdgerdirFeaturedNewsSlice } from './adgerdirFeaturedNewsSlice.model'
import { mapAdgerdirGroupSlice } from './adgerdirGroupSlice.model'

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

  @Field(() => [Slice])
  content: Array<typeof Slice> = []

  @Field(() => [AdgerdirSlice])
  slices: Array<typeof AdgerdirSlice> = []
}

type AdgerdirSliceTypes = IVidspyrnaFeaturedNews | IVidspyrnaFlokkur

export const mapAdgerdirSlice = (
  slice: AdgerdirSliceTypes,
): typeof AdgerdirSlice => {
  switch (slice.sys.contentType.sys.id) {
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
}: IVidspyrnaFrontpage): AdgerdirFrontpage => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  content: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  slices: fields.slices.map(mapAdgerdirSlice),
})
