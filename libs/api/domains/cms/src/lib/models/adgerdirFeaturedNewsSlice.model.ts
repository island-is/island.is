import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IVidspyrnaFeaturedNews } from '../generated/contentfulTypes'

import { AdgerdirNews, mapAdgerdirNewsItem } from './adgerdirNews.model'

@ObjectType()
export class AdgerdirFeaturedNewsSlice {
  constructor(initializer: AdgerdirFeaturedNewsSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [AdgerdirNews])
  featured: AdgerdirNews[]
}

export const mapAdgerdirFeaturedNewsSlice = ({
  fields,
  sys,
}: IVidspyrnaFeaturedNews): AdgerdirFeaturedNewsSlice =>
  new AdgerdirFeaturedNewsSlice({
    id: sys.id,
    title: fields.title,
    featured: fields.featured.map(mapAdgerdirNewsItem),
  })
