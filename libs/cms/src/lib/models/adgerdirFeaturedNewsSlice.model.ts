import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IVidspyrnaFeaturedNews } from '../generated/contentfulTypes'
import { News, mapNews } from './news.model'

@ObjectType()
export class AdgerdirFeaturedNewsSlice {
  constructor(initializer: AdgerdirFeaturedNewsSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @CacheField(() => [News])
  featured!: News[]
}

export const mapAdgerdirFeaturedNewsSlice = ({
  fields,
  sys,
}: IVidspyrnaFeaturedNews): AdgerdirFeaturedNewsSlice =>
  new AdgerdirFeaturedNewsSlice({
    id: sys?.id ?? '',
    title: fields?.title ?? '',
    featured: fields?.featured ? fields.featured.map(mapNews) : [],
  })
