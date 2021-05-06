import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFeaturedArticles } from '../generated/contentfulTypes'

import { SystemMetadata } from 'api-cms-domain'
import { Image, mapImage } from './image.model'
import { Article, mapArticle } from './article.model'
import { Link, mapLink } from './link.model'
import { GetArticlesInput } from '../dto/getArticles.input'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SortField } from '@island.is/content-search-toolkit'

@ObjectType()
export class FeaturedArticles {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  image?: Image | null

  @Field(() => [Article])
  articles!: GetArticlesInput

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
  articles: {
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    size: 5,
    sort: SortField.POPULAR,
    organization: fields.organization?.fields.slug ?? '',
  },
  link: fields.link ? mapLink(fields.link) : null,
})
