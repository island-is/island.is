import graphqlTypeJson from 'graphql-type-json'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
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
import { mapStepper, Stepper } from './stepper.model'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'

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

  @CacheField(() => [SliceUnion])
  body: Array<typeof SliceUnion> = []

  @CacheField(() => ProcessEntry, { nullable: true })
  processEntry?: ProcessEntry | null

  @CacheField(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory | null

  @CacheField(() => [ArticleCategory], { nullable: true })
  otherCategories?: Array<ArticleCategory>

  @CacheField(() => ArticleGroup, { nullable: true })
  group?: ArticleGroup | null

  @CacheField(() => [ArticleGroup], { nullable: true })
  otherGroups?: Array<ArticleGroup>

  @CacheField(() => ArticleSubgroup, { nullable: true })
  subgroup?: ArticleSubgroup | null

  @CacheField(() => [ArticleSubgroup], { nullable: true })
  otherSubgroups?: Array<ArticleSubgroup>

  @CacheField(() => [Organization], { nullable: true })
  organization?: Array<Organization>

  @CacheField(() => [Organization], { nullable: true })
  relatedOrganization?: Array<Organization>

  @CacheField(() => [Organization], { nullable: true })
  responsibleParty?: Array<Organization>

  @CacheField(() => [SubArticle])
  subArticles: Array<SubArticle> = []

  @CacheField(() => [Article], { nullable: true })
  relatedArticles?: Array<Article>

  @CacheField(() => [Link], { nullable: true })
  relatedContent?: Array<Link>

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null

  @Field({ nullable: true })
  showTableOfContents?: boolean

  @CacheField(() => Stepper, { nullable: true })
  stepper?: Stepper | null

  @Field({ nullable: true })
  processEntryButtonText?: string

  @CacheField(() => AlertBanner, { nullable: true })
  alertBanner?: AlertBanner | null

  @Field(() => graphqlTypeJson, { nullable: true })
  activeTranslations?: Record<string, boolean>

  @CacheField(() => EmbeddedVideo, { nullable: true })
  signLanguageVideo?: EmbeddedVideo | null
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
    .filter((subArticle) => subArticle.fields?.title && subArticle.fields?.url)
    .map(mapSubArticle),
  relatedArticles: [], // populated by resolver
  relatedContent: (fields.relatedContent ?? []).map(mapLink),
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  showTableOfContents: fields.showTableOfContents ?? false,
  stepper: fields.stepper ? mapStepper(fields.stepper) : null,
  processEntryButtonText: fields.processEntryButtonText ?? '',
  alertBanner: fields.alertBanner ? mapAlertBanner(fields.alertBanner) : null,
  activeTranslations: fields.activeTranslations ?? { en: true },
  signLanguageVideo: fields.signLanguageVideo
    ? mapEmbeddedVideo(fields.signLanguageVideo)
    : null,
})
