import { Field, ObjectType } from '@nestjs/graphql'

import { IVidspyrnaFeaturedNews } from '../generated/contentfulTypes'

import { News, mapNews } from './news.model'

@ObjectType()
export class VidspyrnaFeaturedNews {
  @Field({ nullable: true })
  title?: string

  @Field(() => [News])
  featured: Array<News>
}

export const mapVidspyrnaFeaturedNews = ({
  fields,
}: IVidspyrnaFeaturedNews): VidspyrnaFeaturedNews => ({
  title: fields.title ?? '',
  featured: fields.featured.map(mapNews),
})
