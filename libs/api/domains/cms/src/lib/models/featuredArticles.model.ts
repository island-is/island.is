import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IArticle, IFeaturedArticles } from '../generated/contentfulTypes'

import { SystemMetadata } from 'api-cms-domain'
import {Image, mapImage} from "./image.model";

@ObjectType()
export class FeaturedArticle {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  title: string

  @Field()
  slug: string
}

export const mapFeaturedArticle = ({
  sys,
  fields,
}: IArticle): FeaturedArticle => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
})

@ObjectType()
export class FeaturedArticles {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  image?: Image

  @Field(() => [FeaturedArticle])
  articles: Array<FeaturedArticle>
}

export const mapFeaturedArticles = ({
  sys,
  fields,
}: IFeaturedArticles): SystemMetadata<FeaturedArticles> => ({
  typename: 'FeaturedArticles',
  id: sys.id,
  title: fields.title,
  image: mapImage(fields.image),
  articles: fields.articles.map(mapFeaturedArticle),
})
