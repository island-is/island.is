import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IArticle } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { ArticleGroup, mapArticleGroup } from './articleGroup.model'
import { ArticleSubgroup, mapArticleSubgroup } from './articleSubgroup.model'
import { Organization, mapOrganization } from './organization.model'
import { SubArticle, mapSubArticle } from './subArticle.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { mapProcessEntry, ProcessEntry } from './processEntry.model'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class Article {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  shortTitle?: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  importance?: number

  @Field(() => [SliceUnion])
  body: Array<typeof SliceUnion> = []

  @Field(() => ProcessEntry, { nullable: true })
  processEntry?: ProcessEntry | null

  @Field(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory | null

  @Field(() => [ArticleCategory], { nullable: true })
  otherCategories?: Array<ArticleCategory>

  @Field(() => ArticleGroup, { nullable: true })
  group?: ArticleGroup | null

  @Field(() => [ArticleGroup], { nullable: true })
  otherGroups?: Array<ArticleGroup>

  @Field(() => ArticleSubgroup, { nullable: true })
  subgroup?: ArticleSubgroup | null

  @Field(() => [ArticleSubgroup], { nullable: true })
  otherSubgroups?: Array<ArticleSubgroup>

  @Field(() => [Organization], { nullable: true })
  organization?: Array<Organization>

  @Field(() => [Organization], { nullable: true })
  relatedOrganization?: Array<Organization>

  @Field(() => [Organization], { nullable: true })
  responsibleParty?: Array<Organization>

  @Field(() => [SubArticle])
  subArticles: Array<SubArticle> = []

  @Field(() => [Article], { nullable: true })
  relatedArticles?: Array<Article>

  @Field(() => [Link], { nullable: true })
  relatedContent?: Array<Link>

  @Field(() => Image, { nullable: true })
  featuredImage?: Image | null

  @Field({ nullable: true })
  showTableOfContents?: boolean
}

export const mapArticle = ({
  fields,
  sys,
}: IArticle): SystemMetadata<Article> => ({
  typename: 'Article',
  id: sys.id,
  title: fields.title ?? '',
  shortTitle: fields.shortTitle ?? '',
  slug: fields.slug ?? '',
  intro: fields.intro ?? '',
  importance: fields.importance ?? 0,
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  processEntry: fields.processEntry
    ? mapProcessEntry(fields.processEntry)
    : null,
  category: fields.category ? mapArticleCategory(fields.category) : null,
  otherCategories: (fields.otherCategories ?? []).map(mapArticleCategory),
  group: fields.group ? mapArticleGroup(fields.group) : null,
  otherGroups: (fields.otherGroups ?? []).map(mapArticleGroup),
  subgroup: fields.subgroup ? mapArticleSubgroup(fields.subgroup) : null,
  otherSubgroups: (fields.otherSubgroups ?? []).map(mapArticleSubgroup),
  organization: (fields.organization ?? [])
    .filter(
      (organization) => organization.fields?.title && organization.fields?.slug,
    )
    .map(mapOrganization),
  relatedOrganization: (fields.relatedOrganization ?? [])
    .filter(
      (relatedOrganization) =>
        relatedOrganization.fields?.title && relatedOrganization.fields?.slug,
    )
    .map(mapOrganization),
  responsibleParty: (fields.responsibleParty ?? [])
    .filter(
      (responsibleParty) =>
        responsibleParty.fields?.title && responsibleParty.fields?.slug,
    )
    .map(mapOrganization),
  subArticles: (fields.subArticles ?? [])
    .filter((subArticle) => subArticle.fields?.title && subArticle.fields?.slug)
    .map(mapSubArticle),
  relatedArticles: [], // populated by resolver
  relatedContent: (fields.relatedContent ?? []).map(mapLink),
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  showTableOfContents: fields.showTableOfContents ?? false,
})
