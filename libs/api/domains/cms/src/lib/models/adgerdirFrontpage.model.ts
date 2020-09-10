import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'

import {
  IVidspyrnaFrontpage,
  IVidspyrnaFeaturedNews,
  IVidspyrnaFlokkur,
} from '../generated/contentfulTypes'

import { AdgerdirSlice } from './adgerdirSlices/adgerdirSlice.model'
import { mapAdgerdirFeaturedNewsSlice } from './adgerdirSlices/adgerdirFeaturedNewsSlice.model'
import { mapAdgerdirGroupSlice } from './adgerdirSlices/adgerdirGroupSlice.model'

@ObjectType()
export class AdgerdirFrontpage {
  @Field(() => ID)
  id: string

  @Field()
  slug: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => [AdgerdirSlice])
  slices: Array<typeof AdgerdirSlice>
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
        `Can not convert to slice: ${(slice as any).sys.contentType.sys.id}`,
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
  content: fields.content && JSON.stringify(fields.content),
  slices: fields.slices.map(mapAdgerdirSlice),
})
