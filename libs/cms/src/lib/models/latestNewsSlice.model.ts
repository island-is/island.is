import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { GetNewsInput } from '../dto/getNews.input'
import { ILatestNewsSlice } from '../generated/contentfulTypes'
import { News } from './news.model'
import { mapGenericTag } from './genericTag.model'
import { Link, mapLink } from './link.model'
import { mapOrganization } from './organization.model'

@ObjectType()
export class LatestNewsSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  tag?: string

  @Field()
  readMoreText?: string

  @CacheField(() => [News])
  news!: GetNewsInput

  @CacheField(() => Link, { nullable: true })
  readMoreLink?: Link | null
}

export const mapLatestNewsSlice = ({
  fields,
  sys,
}: ILatestNewsSlice): SystemMetadata<LatestNewsSlice> => ({
  typename: 'LatestNewsSlice',
  id: sys.id,
  title: fields.title ?? '',
  tag: fields.newsTag?.fields.slug ?? '',
  readMoreText: fields.readMoreText ?? '',
  news: {
    tags: fields.newsTag ? [mapGenericTag(fields.newsTag).slug] : [],
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    size: 4,
    order: 'desc',
    organization: fields.organization
      ? mapOrganization(fields.organization).slug
      : undefined,
  },
  readMoreLink: fields.readMoreLink ? mapLink(fields.readMoreLink) : null,
})
