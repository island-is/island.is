import { Field, ObjectType, ID } from '@nestjs/graphql'
import { isEmpty } from 'lodash'

import { IArticle } from '../generated/contentfulTypes'
import { Slice, mapDocument } from './slice.model'

import { ArticleCategory } from './articleCategory.model'
import { ArticleGroup } from './articleGroup.model'
import { ArticleSubgroup } from './articleSubgroup.model'
import { Organization, mapOrganization } from './organization.model'
import { SubArticle, mapSubArticle } from './subArticle.model'

@ObjectType()
export class Article {
  @Field(() => ID)
  id: string

  @Field()
  contentStatus: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  shortTitle?: string

  @Field({ nullable: true })
  intro?: string

  @Field(() => [Slice])
  body: Array<typeof Slice>

  @Field(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory

  @Field(() => ArticleGroup, { nullable: true })
  group?: ArticleGroup

  @Field(() => ArticleSubgroup, { nullable: true })
  subgroup?: ArticleSubgroup

  @Field(() => [Organization], { nullable: true })
  organization?: Array<Organization>

  @Field(() => [SubArticle])
  subArticles: Array<SubArticle>

  @Field(() => [Article], { nullable: true })
  relatedArticles?: Array<Article>
}

export const mapArticle = ({ fields, sys }: IArticle): Article => ({
  id: sys.id,
  contentStatus: fields.contentStatus,
  title: fields.title,
  shortTitle: fields.shortTitle ?? '',
  slug: fields.slug,
  intro: fields.intro ?? '',
  body: fields?.content ? mapDocument(fields.content) : [],
  category: fields.category?.fields,
  group: fields.group?.fields,
  subgroup: fields.subgroup?.fields,
  organization: (fields?.organization ?? [])
    .filter((doc) => !isEmpty(doc))
    .map(mapOrganization),
  subArticles: (fields?.subArticles ?? [])
    .filter((doc) => !isEmpty(doc))
    .map(mapSubArticle),
  relatedArticles: (fields?.relatedArticles ?? [])
    .filter((doc) => !isEmpty(doc))
    .map(mapArticle),
})
