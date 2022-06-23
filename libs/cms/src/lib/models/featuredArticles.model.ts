import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFeaturedArticles } from '../generated/contentfulTypes'

import { SystemMetadata } from 'api-cms-domain'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { ArticleReference, mapArticleReference } from './articleReference'

@ObjectType()
export class FeaturedArticles {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => [ArticleReference])
  articles?: Array<ArticleReference>

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
  articles: (fields.articles ?? []).map(mapArticleReference),
  link: fields.link ? mapLink(fields.link) : null,
})
