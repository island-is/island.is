import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFeaturedArticles } from '../generated/contentfulTypes'

import { SystemMetadata } from 'api-cms-domain'
import { Image, mapImage } from './image.model'
import { Article, mapArticle } from './article.model'
import { Link, mapLink } from './link.model'

@ObjectType()
export class FeaturedArticles {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => [Article])
  articles?: Array<Article>

  @Field(() => Link, { nullable: true })
  link?: Link | null
}

export const mapFeaturedArticles = ({
  sys,
  fields,
}: IFeaturedArticles): SystemMetadata<FeaturedArticles> => ({
  typename: 'FeaturedArticles',
  id: sys.id,
  title: fields.title ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  articles: (fields.articles ?? []).map(mapArticle),
  link: fields.link ? mapLink(fields.link) : null,
})
