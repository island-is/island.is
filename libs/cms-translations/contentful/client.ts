import { GraphQLClient } from 'graphql-request'
import * as Dom from 'graphql-request/dist/types.dom'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: Date
  Dimension: any
  HexColor: any
  JSON: { [key: string]: any }
  Quality: any
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSlice = Entry & {
  __typename?: 'AccordionSlice'
  accordionItemsCollection?: Maybe<AccordionSliceAccordionItemsCollection>
  contentfulMetadata: ContentfulMetadata
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  linkedFrom?: Maybe<AccordionSliceLinkingCollections>
  showTitle?: Maybe<Scalars['Boolean']>
  sys: Sys
  title?: Maybe<Scalars['String']>
  titleHeadingLevel?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceAccordionItemsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceHasBorderAboveArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceShowTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceTitleHeadingLevelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A slice with accordions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/accordionSlice) */
export type AccordionSliceTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type AccordionSliceAccordionItemsCollection = {
  __typename?: 'AccordionSliceAccordionItemsCollection'
  items: Array<Maybe<OneColumnText>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type AccordionSliceCollection = {
  __typename?: 'AccordionSliceCollection'
  items: Array<Maybe<AccordionSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type AccordionSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<AccordionSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<AccordionSliceFilter>>>
  accordionItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  hasBorderAbove?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_not?: InputMaybe<Scalars['Boolean']>
  showTitle?: InputMaybe<Scalars['Boolean']>
  showTitle_exists?: InputMaybe<Scalars['Boolean']>
  showTitle_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  titleHeadingLevel?: InputMaybe<Scalars['String']>
  titleHeadingLevel_contains?: InputMaybe<Scalars['String']>
  titleHeadingLevel_exists?: InputMaybe<Scalars['Boolean']>
  titleHeadingLevel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  titleHeadingLevel_not?: InputMaybe<Scalars['String']>
  titleHeadingLevel_not_contains?: InputMaybe<Scalars['String']>
  titleHeadingLevel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type AccordionSliceLinkingCollections = {
  __typename?: 'AccordionSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type AccordionSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AccordionSliceLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AccordionSliceLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AccordionSliceLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AccordionSliceLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum AccordionSliceOrder {
  HasBorderAboveAsc = 'hasBorderAbove_ASC',
  HasBorderAboveDesc = 'hasBorderAbove_DESC',
  ShowTitleAsc = 'showTitle_ASC',
  ShowTitleDesc = 'showTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleHeadingLevelAsc = 'titleHeadingLevel_ASC',
  TitleHeadingLevelDesc = 'titleHeadingLevel_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBanner = Entry & {
  __typename?: 'AlertBanner'
  bannerVariant?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  dismissedForDays?: Maybe<Scalars['Int']>
  isDismissable?: Maybe<Scalars['Boolean']>
  link?: Maybe<LinkUrl>
  linkTitle?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<AlertBannerLinkingCollections>
  servicePortalPaths?: Maybe<Array<Maybe<Scalars['String']>>>
  showAlertBanner?: Maybe<Scalars['Boolean']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerBannerVariantArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerDismissedForDaysArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerIsDismissableArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerLinkTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerServicePortalPathsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerShowAlertBannerArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Alert banner will show on top of all pages [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/alertBanner) */
export type AlertBannerTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type AlertBannerCollection = {
  __typename?: 'AlertBannerCollection'
  items: Array<Maybe<AlertBanner>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type AlertBannerFilter = {
  AND?: InputMaybe<Array<InputMaybe<AlertBannerFilter>>>
  OR?: InputMaybe<Array<InputMaybe<AlertBannerFilter>>>
  bannerVariant?: InputMaybe<Scalars['String']>
  bannerVariant_contains?: InputMaybe<Scalars['String']>
  bannerVariant_exists?: InputMaybe<Scalars['Boolean']>
  bannerVariant_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  bannerVariant_not?: InputMaybe<Scalars['String']>
  bannerVariant_not_contains?: InputMaybe<Scalars['String']>
  bannerVariant_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  dismissedForDays?: InputMaybe<Scalars['Int']>
  dismissedForDays_exists?: InputMaybe<Scalars['Boolean']>
  dismissedForDays_gt?: InputMaybe<Scalars['Int']>
  dismissedForDays_gte?: InputMaybe<Scalars['Int']>
  dismissedForDays_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  dismissedForDays_lt?: InputMaybe<Scalars['Int']>
  dismissedForDays_lte?: InputMaybe<Scalars['Int']>
  dismissedForDays_not?: InputMaybe<Scalars['Int']>
  dismissedForDays_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  isDismissable?: InputMaybe<Scalars['Boolean']>
  isDismissable_exists?: InputMaybe<Scalars['Boolean']>
  isDismissable_not?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<CfLinkUrlNestedFilter>
  linkTitle?: InputMaybe<Scalars['String']>
  linkTitle_contains?: InputMaybe<Scalars['String']>
  linkTitle_exists?: InputMaybe<Scalars['Boolean']>
  linkTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkTitle_not?: InputMaybe<Scalars['String']>
  linkTitle_not_contains?: InputMaybe<Scalars['String']>
  linkTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_exists?: InputMaybe<Scalars['Boolean']>
  servicePortalPaths_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  servicePortalPaths_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  servicePortalPaths_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  servicePortalPaths_exists?: InputMaybe<Scalars['Boolean']>
  showAlertBanner?: InputMaybe<Scalars['Boolean']>
  showAlertBanner_exists?: InputMaybe<Scalars['Boolean']>
  showAlertBanner_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type AlertBannerLinkingCollections = {
  __typename?: 'AlertBannerLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
}

export type AlertBannerLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AlertBannerLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AlertBannerLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum AlertBannerOrder {
  BannerVariantAsc = 'bannerVariant_ASC',
  BannerVariantDesc = 'bannerVariant_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  DismissedForDaysAsc = 'dismissedForDays_ASC',
  DismissedForDaysDesc = 'dismissedForDays_DESC',
  IsDismissableAsc = 'isDismissable_ASC',
  IsDismissableDesc = 'isDismissable_DESC',
  LinkTitleAsc = 'linkTitle_ASC',
  LinkTitleDesc = 'linkTitle_DESC',
  ShowAlertBannerAsc = 'showAlertBanner_ASC',
  ShowAlertBannerDesc = 'showAlertBanner_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/appUri) */
export type AppUri = Entry & {
  __typename?: 'AppUri'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<AppUriLinkingCollections>
  sys: Sys
  uri?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/appUri) */
export type AppUriLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/appUri) */
export type AppUriUriArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type AppUriCollection = {
  __typename?: 'AppUriCollection'
  items: Array<Maybe<AppUri>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type AppUriFilter = {
  AND?: InputMaybe<Array<InputMaybe<AppUriFilter>>>
  OR?: InputMaybe<Array<InputMaybe<AppUriFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  uri?: InputMaybe<Scalars['String']>
  uri_contains?: InputMaybe<Scalars['String']>
  uri_exists?: InputMaybe<Scalars['Boolean']>
  uri_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  uri_not?: InputMaybe<Scalars['String']>
  uri_not_contains?: InputMaybe<Scalars['String']>
  uri_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type AppUriLinkingCollections = {
  __typename?: 'AppUriLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type AppUriLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum AppUriOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  UriAsc = 'uri_ASC',
  UriDesc = 'uri_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type Article = Entry & {
  __typename?: 'Article'
  alertBanner?: Maybe<AlertBanner>
  category?: Maybe<ArticleCategory>
  content?: Maybe<ArticleContent>
  contentStatus?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  featuredImage?: Maybe<Asset>
  group?: Maybe<ArticleGroup>
  importance?: Maybe<Scalars['Int']>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<ArticleLinkingCollections>
  organizationCollection?: Maybe<ArticleOrganizationCollection>
  otherCategoriesCollection?: Maybe<ArticleOtherCategoriesCollection>
  otherGroupsCollection?: Maybe<ArticleOtherGroupsCollection>
  otherSubgroupsCollection?: Maybe<ArticleOtherSubgroupsCollection>
  processEntry?: Maybe<ProcessEntry>
  processEntryButtonText?: Maybe<Scalars['String']>
  relatedArticlesCollection?: Maybe<ArticleRelatedArticlesCollection>
  relatedContentCollection?: Maybe<ArticleRelatedContentCollection>
  relatedOrganizationCollection?: Maybe<ArticleRelatedOrganizationCollection>
  responsiblePartyCollection?: Maybe<ArticleResponsiblePartyCollection>
  shortTitle?: Maybe<Scalars['String']>
  showTableOfContents?: Maybe<Scalars['Boolean']>
  slug?: Maybe<Scalars['String']>
  stepper?: Maybe<Stepper>
  subArticlesCollection?: Maybe<ArticleSubArticlesCollection>
  subgroup?: Maybe<ArticleSubgroup>
  sys: Sys
  title?: Maybe<Scalars['String']>
  userStories?: Maybe<ArticleUserStories>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleAlertBannerArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleContentStatusArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleGroupArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleImportanceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleOtherCategoriesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleOtherGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleOtherSubgroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleProcessEntryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleProcessEntryButtonTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleRelatedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleRelatedContentCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleRelatedOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleResponsiblePartyCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleShortTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleShowTableOfContentsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleStepperArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleSubArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleSubgroupArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/article) */
export type ArticleUserStoriesArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleCategory) */
export type ArticleCategory = Entry & {
  __typename?: 'ArticleCategory'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<ArticleCategoryLinkingCollections>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleCategory) */
export type ArticleCategoryDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleCategory) */
export type ArticleCategoryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleCategory) */
export type ArticleCategorySlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleCategory) */
export type ArticleCategoryTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ArticleCategoryCollection = {
  __typename?: 'ArticleCategoryCollection'
  items: Array<Maybe<ArticleCategory>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleCategoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<ArticleCategoryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ArticleCategoryFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ArticleCategoryLinkingCollections = {
  __typename?: 'ArticleCategoryLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  lifeEventPageCollection?: Maybe<LifeEventPageCollection>
  linkCollection?: Maybe<LinkCollection>
  linkedPageCollection?: Maybe<LinkedPageCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  urlCollection?: Maybe<UrlCollection>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
}

export type ArticleCategoryLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsLifeEventPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsLinkedPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleCategoryLinkingCollectionsVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ArticleCategoryOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ArticleCollection = {
  __typename?: 'ArticleCollection'
  items: Array<Maybe<Article>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleContent = {
  __typename?: 'ArticleContent'
  json: Scalars['JSON']
  links: ArticleContentLinks
}

export type ArticleContentAssets = {
  __typename?: 'ArticleContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type ArticleContentEntries = {
  __typename?: 'ArticleContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type ArticleContentLinks = {
  __typename?: 'ArticleContentLinks'
  assets: ArticleContentAssets
  entries: ArticleContentEntries
}

export type ArticleFilter = {
  AND?: InputMaybe<Array<InputMaybe<ArticleFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ArticleFilter>>>
  alertBanner?: InputMaybe<CfAlertBannerNestedFilter>
  alertBanner_exists?: InputMaybe<Scalars['Boolean']>
  category?: InputMaybe<CfArticleCategoryNestedFilter>
  category_exists?: InputMaybe<Scalars['Boolean']>
  contentStatus?: InputMaybe<Scalars['String']>
  contentStatus_contains?: InputMaybe<Scalars['String']>
  contentStatus_exists?: InputMaybe<Scalars['Boolean']>
  contentStatus_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentStatus_not?: InputMaybe<Scalars['String']>
  contentStatus_not_contains?: InputMaybe<Scalars['String']>
  contentStatus_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  group?: InputMaybe<CfArticleGroupNestedFilter>
  group_exists?: InputMaybe<Scalars['Boolean']>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organizationCollection_exists?: InputMaybe<Scalars['Boolean']>
  otherCategoriesCollection_exists?: InputMaybe<Scalars['Boolean']>
  otherGroupsCollection_exists?: InputMaybe<Scalars['Boolean']>
  otherSubgroupsCollection_exists?: InputMaybe<Scalars['Boolean']>
  processEntry?: InputMaybe<CfProcessEntryNestedFilter>
  processEntryButtonText?: InputMaybe<Scalars['String']>
  processEntryButtonText_contains?: InputMaybe<Scalars['String']>
  processEntryButtonText_exists?: InputMaybe<Scalars['Boolean']>
  processEntryButtonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processEntryButtonText_not?: InputMaybe<Scalars['String']>
  processEntryButtonText_not_contains?: InputMaybe<Scalars['String']>
  processEntryButtonText_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  processEntry_exists?: InputMaybe<Scalars['Boolean']>
  relatedArticlesCollection_exists?: InputMaybe<Scalars['Boolean']>
  relatedContentCollection_exists?: InputMaybe<Scalars['Boolean']>
  relatedOrganizationCollection_exists?: InputMaybe<Scalars['Boolean']>
  responsiblePartyCollection_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle?: InputMaybe<Scalars['String']>
  shortTitle_contains?: InputMaybe<Scalars['String']>
  shortTitle_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle_not?: InputMaybe<Scalars['String']>
  shortTitle_not_contains?: InputMaybe<Scalars['String']>
  shortTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  showTableOfContents?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_exists?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_not?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  stepper?: InputMaybe<CfStepperNestedFilter>
  stepper_exists?: InputMaybe<Scalars['Boolean']>
  subArticlesCollection_exists?: InputMaybe<Scalars['Boolean']>
  subgroup?: InputMaybe<CfArticleSubgroupNestedFilter>
  subgroup_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  userStories_contains?: InputMaybe<Scalars['String']>
  userStories_exists?: InputMaybe<Scalars['Boolean']>
  userStories_not_contains?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleGroup) */
export type ArticleGroup = Entry & {
  __typename?: 'ArticleGroup'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  importance?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<ArticleGroupLinkingCollections>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleGroup) */
export type ArticleGroupDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleGroup) */
export type ArticleGroupImportanceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleGroup) */
export type ArticleGroupLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleGroup) */
export type ArticleGroupSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleGroup) */
export type ArticleGroupTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ArticleGroupCollection = {
  __typename?: 'ArticleGroupCollection'
  items: Array<Maybe<ArticleGroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleGroupFilter = {
  AND?: InputMaybe<Array<InputMaybe<ArticleGroupFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ArticleGroupFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ArticleGroupLinkingCollections = {
  __typename?: 'ArticleGroupLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
}

export type ArticleGroupLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleGroupLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleGroupLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleGroupLinkingCollectionsVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ArticleGroupOrder {
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ArticleLinkingCollections = {
  __typename?: 'ArticleLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  featuredCollection?: Maybe<FeaturedCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  linkCollection?: Maybe<LinkCollection>
  linkedPageCollection?: Maybe<LinkedPageCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  storyCollection?: Maybe<StoryCollection>
  subArticleCollection?: Maybe<SubArticleCollection>
  urlCollection?: Maybe<UrlCollection>
}

export type ArticleLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsLinkedPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsSubArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ArticleOrder {
  ContentStatusAsc = 'contentStatus_ASC',
  ContentStatusDesc = 'contentStatus_DESC',
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  ProcessEntryButtonTextAsc = 'processEntryButtonText_ASC',
  ProcessEntryButtonTextDesc = 'processEntryButtonText_DESC',
  ShortTitleAsc = 'shortTitle_ASC',
  ShortTitleDesc = 'shortTitle_DESC',
  ShowTableOfContentsAsc = 'showTableOfContents_ASC',
  ShowTableOfContentsDesc = 'showTableOfContents_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ArticleOrganizationCollection = {
  __typename?: 'ArticleOrganizationCollection'
  items: Array<Maybe<Organization>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleOtherCategoriesCollection = {
  __typename?: 'ArticleOtherCategoriesCollection'
  items: Array<Maybe<ArticleCategory>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleOtherGroupsCollection = {
  __typename?: 'ArticleOtherGroupsCollection'
  items: Array<Maybe<ArticleGroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleOtherSubgroupsCollection = {
  __typename?: 'ArticleOtherSubgroupsCollection'
  items: Array<Maybe<ArticleSubgroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleRelatedArticlesCollection = {
  __typename?: 'ArticleRelatedArticlesCollection'
  items: Array<Maybe<Article>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleRelatedContentCollection = {
  __typename?: 'ArticleRelatedContentCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleRelatedOrganizationCollection = {
  __typename?: 'ArticleRelatedOrganizationCollection'
  items: Array<Maybe<Organization>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleResponsiblePartyCollection = {
  __typename?: 'ArticleResponsiblePartyCollection'
  items: Array<Maybe<Organization>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleSubArticlesCollection = {
  __typename?: 'ArticleSubArticlesCollection'
  items: Array<Maybe<SubArticle>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Used inside groups to further categorize articles by subject [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleSubgroup) */
export type ArticleSubgroup = Entry & {
  __typename?: 'ArticleSubgroup'
  contentfulMetadata: ContentfulMetadata
  importance?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<ArticleSubgroupLinkingCollections>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Used inside groups to further categorize articles by subject [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleSubgroup) */
export type ArticleSubgroupImportanceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Used inside groups to further categorize articles by subject [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleSubgroup) */
export type ArticleSubgroupLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Used inside groups to further categorize articles by subject [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleSubgroup) */
export type ArticleSubgroupSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Used inside groups to further categorize articles by subject [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/articleSubgroup) */
export type ArticleSubgroupTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ArticleSubgroupCollection = {
  __typename?: 'ArticleSubgroupCollection'
  items: Array<Maybe<ArticleSubgroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ArticleSubgroupFilter = {
  AND?: InputMaybe<Array<InputMaybe<ArticleSubgroupFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ArticleSubgroupFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ArticleSubgroupLinkingCollections = {
  __typename?: 'ArticleSubgroupLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
}

export type ArticleSubgroupLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleSubgroupLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ArticleSubgroupLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ArticleSubgroupOrder {
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ArticleUserStories = {
  __typename?: 'ArticleUserStories'
  json: Scalars['JSON']
  links: ArticleUserStoriesLinks
}

export type ArticleUserStoriesAssets = {
  __typename?: 'ArticleUserStoriesAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type ArticleUserStoriesEntries = {
  __typename?: 'ArticleUserStoriesEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type ArticleUserStoriesLinks = {
  __typename?: 'ArticleUserStoriesLinks'
  assets: ArticleUserStoriesAssets
  entries: ArticleUserStoriesEntries
}

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = {
  __typename?: 'Asset'
  contentType?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  fileName?: Maybe<Scalars['String']>
  height?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<AssetLinkingCollections>
  size?: Maybe<Scalars['Int']>
  sys: Sys
  title?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
  width?: Maybe<Scalars['Int']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetContentTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetFileNameArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetHeightArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetSizeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
  transform?: InputMaybe<ImageTransformOptions>
}

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetWidthArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type AssetCollection = {
  __typename?: 'AssetCollection'
  items: Array<Maybe<Asset>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type AssetFilter = {
  AND?: InputMaybe<Array<InputMaybe<AssetFilter>>>
  OR?: InputMaybe<Array<InputMaybe<AssetFilter>>>
  contentType?: InputMaybe<Scalars['String']>
  contentType_contains?: InputMaybe<Scalars['String']>
  contentType_exists?: InputMaybe<Scalars['Boolean']>
  contentType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentType_not?: InputMaybe<Scalars['String']>
  contentType_not_contains?: InputMaybe<Scalars['String']>
  contentType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fileName?: InputMaybe<Scalars['String']>
  fileName_contains?: InputMaybe<Scalars['String']>
  fileName_exists?: InputMaybe<Scalars['Boolean']>
  fileName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fileName_not?: InputMaybe<Scalars['String']>
  fileName_not_contains?: InputMaybe<Scalars['String']>
  fileName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  height?: InputMaybe<Scalars['Int']>
  height_exists?: InputMaybe<Scalars['Boolean']>
  height_gt?: InputMaybe<Scalars['Int']>
  height_gte?: InputMaybe<Scalars['Int']>
  height_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  height_lt?: InputMaybe<Scalars['Int']>
  height_lte?: InputMaybe<Scalars['Int']>
  height_not?: InputMaybe<Scalars['Int']>
  height_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  size?: InputMaybe<Scalars['Int']>
  size_exists?: InputMaybe<Scalars['Boolean']>
  size_gt?: InputMaybe<Scalars['Int']>
  size_gte?: InputMaybe<Scalars['Int']>
  size_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  size_lt?: InputMaybe<Scalars['Int']>
  size_lte?: InputMaybe<Scalars['Int']>
  size_not?: InputMaybe<Scalars['Int']>
  size_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  width?: InputMaybe<Scalars['Int']>
  width_exists?: InputMaybe<Scalars['Boolean']>
  width_gt?: InputMaybe<Scalars['Int']>
  width_gte?: InputMaybe<Scalars['Int']>
  width_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  width_lt?: InputMaybe<Scalars['Int']>
  width_lte?: InputMaybe<Scalars['Int']>
  width_not?: InputMaybe<Scalars['Int']>
  width_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
}

export type AssetLinkingCollections = {
  __typename?: 'AssetLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  contentTypeLocationCollection?: Maybe<ContentTypeLocationCollection>
  districtsCollection?: Maybe<DistrictsCollection>
  enhancedAssetCollection?: Maybe<EnhancedAssetCollection>
  entryCollection?: Maybe<EntryCollection>
  eventSliceCollection?: Maybe<EventSliceCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  frontpageCollection?: Maybe<FrontpageCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  graphCardCollection?: Maybe<GraphCardCollection>
  iconBulletCollection?: Maybe<IconBulletCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  lifeEventPageCollection?: Maybe<LifeEventPageCollection>
  logoListSliceCollection?: Maybe<LogoListSliceCollection>
  mailingListSignupCollection?: Maybe<MailingListSignupCollection>
  newsCollection?: Maybe<NewsCollection>
  openDataPageCollection?: Maybe<OpenDataPageCollection>
  openDataSubpageCollection?: Maybe<OpenDataSubpageCollection>
  organizationCollection?: Maybe<OrganizationCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  processEntryCollection?: Maybe<ProcessEntryCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  sectionWithImageCollection?: Maybe<SectionWithImageCollection>
  sidebarCardCollection?: Maybe<SidebarCardCollection>
  statisticsCardCollection?: Maybe<StatisticsCardCollection>
  storyCollection?: Maybe<StoryCollection>
  subpageHeaderCollection?: Maybe<SubpageHeaderCollection>
  tabContentCollection?: Maybe<TabContentCollection>
  teamMemberCollection?: Maybe<TeamMemberCollection>
  tellUsAStoryCollection?: Maybe<TellUsAStoryCollection>
  vidspyrnaFlokkurCollection?: Maybe<VidspyrnaFlokkurCollection>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
}

export type AssetLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsContentTypeLocationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsDistrictsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsEnhancedAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsEventSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsGraphCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsIconBulletCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsLifeEventPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsLogoListSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsMailingListSignupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsOpenDataPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsOpenDataSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsProcessEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsSectionWithImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsSidebarCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsStatisticsCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsSubpageHeaderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsTabContentCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsTeamMemberCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsTellUsAStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsVidspyrnaFlokkurCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type AssetLinkingCollectionsVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum AssetOrder {
  ContentTypeAsc = 'contentType_ASC',
  ContentTypeDesc = 'contentType_DESC',
  FileNameAsc = 'fileName_ASC',
  FileNameDesc = 'fileName_DESC',
  HeightAsc = 'height_ASC',
  HeightDesc = 'height_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
  WidthAsc = 'width_ASC',
  WidthDesc = 'width_DESC',
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type Auction = Entry & {
  __typename?: 'Auction'
  content?: Maybe<AuctionContent>
  contentfulMetadata: ContentfulMetadata
  date?: Maybe<Scalars['DateTime']>
  linkedFrom?: Maybe<AuctionLinkingCollections>
  organization?: Maybe<Organization>
  sys: Sys
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type AuctionContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type AuctionDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type AuctionLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type AuctionOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type AuctionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Used for syslumenn auctions [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/auction) */
export type AuctionTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type AuctionCollection = {
  __typename?: 'AuctionCollection'
  items: Array<Maybe<Auction>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type AuctionContent = {
  __typename?: 'AuctionContent'
  json: Scalars['JSON']
  links: AuctionContentLinks
}

export type AuctionContentAssets = {
  __typename?: 'AuctionContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type AuctionContentEntries = {
  __typename?: 'AuctionContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type AuctionContentLinks = {
  __typename?: 'AuctionContentLinks'
  assets: AuctionContentAssets
  entries: AuctionContentEntries
}

export type AuctionFilter = {
  AND?: InputMaybe<Array<InputMaybe<AuctionFilter>>>
  OR?: InputMaybe<Array<InputMaybe<AuctionFilter>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  date?: InputMaybe<Scalars['DateTime']>
  date_exists?: InputMaybe<Scalars['Boolean']>
  date_gt?: InputMaybe<Scalars['DateTime']>
  date_gte?: InputMaybe<Scalars['DateTime']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  date_lt?: InputMaybe<Scalars['DateTime']>
  date_lte?: InputMaybe<Scalars['DateTime']>
  date_not?: InputMaybe<Scalars['DateTime']>
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type AuctionLinkingCollections = {
  __typename?: 'AuctionLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type AuctionLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum AuctionOrder {
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/bigBulletList) */
export type BigBulletList = Entry & {
  __typename?: 'BigBulletList'
  bulletsCollection?: Maybe<BigBulletListBulletsCollection>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<BigBulletListLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/bigBulletList) */
export type BigBulletListBulletsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/bigBulletList) */
export type BigBulletListLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/bigBulletList) */
export type BigBulletListTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type BigBulletListBulletsCollection = {
  __typename?: 'BigBulletListBulletsCollection'
  items: Array<Maybe<BigBulletListBulletsItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type BigBulletListBulletsItem = IconBullet | NumberBulletSection

export type BigBulletListCollection = {
  __typename?: 'BigBulletListCollection'
  items: Array<Maybe<BigBulletList>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type BigBulletListFilter = {
  AND?: InputMaybe<Array<InputMaybe<BigBulletListFilter>>>
  OR?: InputMaybe<Array<InputMaybe<BigBulletListFilter>>>
  bulletsCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type BigBulletListLinkingCollections = {
  __typename?: 'BigBulletListLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type BigBulletListLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type BigBulletListLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type BigBulletListLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type BigBulletListLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type BigBulletListLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum BigBulletListOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/card) */
export type Card = Entry & {
  __typename?: 'Card'
  body?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  link?: Maybe<Scalars['String']>
  linkText?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<CardLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/card) */
export type CardBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/card) */
export type CardLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/card) */
export type CardLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/card) */
export type CardLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/card) */
export type CardTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type CardCollection = {
  __typename?: 'CardCollection'
  items: Array<Maybe<Card>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type CardFilter = {
  AND?: InputMaybe<Array<InputMaybe<CardFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CardFilter>>>
  body?: InputMaybe<Scalars['String']>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  body_not?: InputMaybe<Scalars['String']>
  body_not_contains?: InputMaybe<Scalars['String']>
  body_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  link?: InputMaybe<Scalars['String']>
  linkText?: InputMaybe<Scalars['String']>
  linkText_contains?: InputMaybe<Scalars['String']>
  linkText_exists?: InputMaybe<Scalars['Boolean']>
  linkText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkText_not?: InputMaybe<Scalars['String']>
  linkText_not_contains?: InputMaybe<Scalars['String']>
  linkText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CardLinkingCollections = {
  __typename?: 'CardLinkingCollections'
  cardSectionCollection?: Maybe<CardSectionCollection>
  entryCollection?: Maybe<EntryCollection>
}

export type CardLinkingCollectionsCardSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type CardLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum CardOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** List of link cards [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/cardSection) */
export type CardSection = Entry & {
  __typename?: 'CardSection'
  cardsCollection?: Maybe<CardSectionCardsCollection>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<CardSectionLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** List of link cards [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/cardSection) */
export type CardSectionCardsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** List of link cards [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/cardSection) */
export type CardSectionLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** List of link cards [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/cardSection) */
export type CardSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type CardSectionCardsCollection = {
  __typename?: 'CardSectionCardsCollection'
  items: Array<Maybe<Card>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type CardSectionCollection = {
  __typename?: 'CardSectionCollection'
  items: Array<Maybe<CardSection>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type CardSectionFilter = {
  AND?: InputMaybe<Array<InputMaybe<CardSectionFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CardSectionFilter>>>
  cardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CardSectionLinkingCollections = {
  __typename?: 'CardSectionLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  openDataPageCollection?: Maybe<OpenDataPageCollection>
}

export type CardSectionLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type CardSectionLinkingCollectionsOpenDataPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum CardSectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUs = Entry & {
  __typename?: 'ContactUs'
  contentfulMetadata: ContentfulMetadata
  errorMessage?: Maybe<Scalars['String']>
  invalidEmail?: Maybe<Scalars['String']>
  invalidPhone?: Maybe<Scalars['String']>
  labelEmail?: Maybe<Scalars['String']>
  labelMessage?: Maybe<Scalars['String']>
  labelName?: Maybe<Scalars['String']>
  labelPhone?: Maybe<Scalars['String']>
  labelSubject?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<ContactUsLinkingCollections>
  required?: Maybe<Scalars['String']>
  submitButtonText?: Maybe<Scalars['String']>
  successMessage?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsInvalidEmailArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsInvalidPhoneArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsLabelEmailArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsLabelMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsLabelNameArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsLabelPhoneArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsLabelSubjectArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsRequiredArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsSubmitButtonTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsSuccessMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/contactUs) */
export type ContactUsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ContactUsCollection = {
  __typename?: 'ContactUsCollection'
  items: Array<Maybe<ContactUs>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ContactUsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ContactUsFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ContactUsFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  errorMessage?: InputMaybe<Scalars['String']>
  errorMessage_contains?: InputMaybe<Scalars['String']>
  errorMessage_exists?: InputMaybe<Scalars['Boolean']>
  errorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  errorMessage_not?: InputMaybe<Scalars['String']>
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  errorMessage_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  invalidEmail?: InputMaybe<Scalars['String']>
  invalidEmail_contains?: InputMaybe<Scalars['String']>
  invalidEmail_exists?: InputMaybe<Scalars['Boolean']>
  invalidEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  invalidEmail_not?: InputMaybe<Scalars['String']>
  invalidEmail_not_contains?: InputMaybe<Scalars['String']>
  invalidEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  invalidPhone?: InputMaybe<Scalars['String']>
  invalidPhone_contains?: InputMaybe<Scalars['String']>
  invalidPhone_exists?: InputMaybe<Scalars['Boolean']>
  invalidPhone_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  invalidPhone_not?: InputMaybe<Scalars['String']>
  invalidPhone_not_contains?: InputMaybe<Scalars['String']>
  invalidPhone_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelEmail?: InputMaybe<Scalars['String']>
  labelEmail_contains?: InputMaybe<Scalars['String']>
  labelEmail_exists?: InputMaybe<Scalars['Boolean']>
  labelEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelEmail_not?: InputMaybe<Scalars['String']>
  labelEmail_not_contains?: InputMaybe<Scalars['String']>
  labelEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelMessage?: InputMaybe<Scalars['String']>
  labelMessage_contains?: InputMaybe<Scalars['String']>
  labelMessage_exists?: InputMaybe<Scalars['Boolean']>
  labelMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelMessage_not?: InputMaybe<Scalars['String']>
  labelMessage_not_contains?: InputMaybe<Scalars['String']>
  labelMessage_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelName?: InputMaybe<Scalars['String']>
  labelName_contains?: InputMaybe<Scalars['String']>
  labelName_exists?: InputMaybe<Scalars['Boolean']>
  labelName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelName_not?: InputMaybe<Scalars['String']>
  labelName_not_contains?: InputMaybe<Scalars['String']>
  labelName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelPhone?: InputMaybe<Scalars['String']>
  labelPhone_contains?: InputMaybe<Scalars['String']>
  labelPhone_exists?: InputMaybe<Scalars['Boolean']>
  labelPhone_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelPhone_not?: InputMaybe<Scalars['String']>
  labelPhone_not_contains?: InputMaybe<Scalars['String']>
  labelPhone_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelSubject?: InputMaybe<Scalars['String']>
  labelSubject_contains?: InputMaybe<Scalars['String']>
  labelSubject_exists?: InputMaybe<Scalars['Boolean']>
  labelSubject_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labelSubject_not?: InputMaybe<Scalars['String']>
  labelSubject_not_contains?: InputMaybe<Scalars['String']>
  labelSubject_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  required?: InputMaybe<Scalars['String']>
  required_contains?: InputMaybe<Scalars['String']>
  required_exists?: InputMaybe<Scalars['Boolean']>
  required_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  required_not?: InputMaybe<Scalars['String']>
  required_not_contains?: InputMaybe<Scalars['String']>
  required_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  submitButtonText?: InputMaybe<Scalars['String']>
  submitButtonText_contains?: InputMaybe<Scalars['String']>
  submitButtonText_exists?: InputMaybe<Scalars['Boolean']>
  submitButtonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  submitButtonText_not?: InputMaybe<Scalars['String']>
  submitButtonText_not_contains?: InputMaybe<Scalars['String']>
  submitButtonText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  successMessage?: InputMaybe<Scalars['String']>
  successMessage_contains?: InputMaybe<Scalars['String']>
  successMessage_exists?: InputMaybe<Scalars['Boolean']>
  successMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  successMessage_not?: InputMaybe<Scalars['String']>
  successMessage_not_contains?: InputMaybe<Scalars['String']>
  successMessage_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ContactUsLinkingCollections = {
  __typename?: 'ContactUsLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type ContactUsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ContactUsLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ContactUsLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ContactUsLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ContactUsOrder {
  ErrorMessageAsc = 'errorMessage_ASC',
  ErrorMessageDesc = 'errorMessage_DESC',
  InvalidEmailAsc = 'invalidEmail_ASC',
  InvalidEmailDesc = 'invalidEmail_DESC',
  InvalidPhoneAsc = 'invalidPhone_ASC',
  InvalidPhoneDesc = 'invalidPhone_DESC',
  LabelEmailAsc = 'labelEmail_ASC',
  LabelEmailDesc = 'labelEmail_DESC',
  LabelMessageAsc = 'labelMessage_ASC',
  LabelMessageDesc = 'labelMessage_DESC',
  LabelNameAsc = 'labelName_ASC',
  LabelNameDesc = 'labelName_DESC',
  LabelPhoneAsc = 'labelPhone_ASC',
  LabelPhoneDesc = 'labelPhone_DESC',
  LabelSubjectAsc = 'labelSubject_ASC',
  LabelSubjectDesc = 'labelSubject_DESC',
  RequiredAsc = 'required_ASC',
  RequiredDesc = 'required_DESC',
  SubmitButtonTextAsc = 'submitButtonText_ASC',
  SubmitButtonTextDesc = 'submitButtonText_DESC',
  SuccessMessageAsc = 'successMessage_ASC',
  SuccessMessageDesc = 'successMessage_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocation = Entry & {
  __typename?: 'ContentTypeLocation'
  address?: Maybe<Scalars['String']>
  background?: Maybe<Asset>
  contentfulMetadata: ContentfulMetadata
  link?: Maybe<Link>
  linkedFrom?: Maybe<ContentTypeLocationLinkingCollections>
  subTitle?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocationAddressArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocationBackgroundArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocationLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocationLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocationSubTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/location) */
export type ContentTypeLocationTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ContentTypeLocationCollection = {
  __typename?: 'ContentTypeLocationCollection'
  items: Array<Maybe<ContentTypeLocation>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ContentTypeLocationFilter = {
  AND?: InputMaybe<Array<InputMaybe<ContentTypeLocationFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ContentTypeLocationFilter>>>
  address?: InputMaybe<Scalars['String']>
  address_contains?: InputMaybe<Scalars['String']>
  address_exists?: InputMaybe<Scalars['Boolean']>
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  address_not?: InputMaybe<Scalars['String']>
  address_not_contains?: InputMaybe<Scalars['String']>
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  background_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  subTitle?: InputMaybe<Scalars['String']>
  subTitle_contains?: InputMaybe<Scalars['String']>
  subTitle_exists?: InputMaybe<Scalars['Boolean']>
  subTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subTitle_not?: InputMaybe<Scalars['String']>
  subTitle_not_contains?: InputMaybe<Scalars['String']>
  subTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ContentTypeLocationLinkingCollections = {
  __typename?: 'ContentTypeLocationLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type ContentTypeLocationLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ContentTypeLocationOrder {
  SubTitleAsc = 'subTitle_ASC',
  SubTitleDesc = 'subTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ContentfulMetadata = {
  __typename?: 'ContentfulMetadata'
  tags: Array<Maybe<ContentfulTag>>
}

export type ContentfulMetadataFilter = {
  tags?: InputMaybe<ContentfulMetadataTagsFilter>
  tags_exists?: InputMaybe<Scalars['Boolean']>
}

export type ContentfulMetadataTagsFilter = {
  id_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  id_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  id_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/**
 * Represents a tag entity for finding and organizing content easily.
 *     Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags
 */
export type ContentfulTag = {
  __typename?: 'ContentfulTag'
  id?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type Districts = Entry & {
  __typename?: 'Districts'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  image?: Maybe<Asset>
  linkedFrom?: Maybe<DistrictsLinkingCollections>
  linksCollection?: Maybe<DistrictsLinksCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type DistrictsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type DistrictsHasBorderAboveArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type DistrictsImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type DistrictsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type DistrictsLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/districts) */
export type DistrictsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type DistrictsCollection = {
  __typename?: 'DistrictsCollection'
  items: Array<Maybe<Districts>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type DistrictsFilter = {
  AND?: InputMaybe<Array<InputMaybe<DistrictsFilter>>>
  OR?: InputMaybe<Array<InputMaybe<DistrictsFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  hasBorderAbove?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_not?: InputMaybe<Scalars['Boolean']>
  image_exists?: InputMaybe<Scalars['Boolean']>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type DistrictsLinkingCollections = {
  __typename?: 'DistrictsLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type DistrictsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type DistrictsLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type DistrictsLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type DistrictsLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type DistrictsLinksCollection = {
  __typename?: 'DistrictsLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum DistrictsOrder {
  HasBorderAboveAsc = 'hasBorderAbove_ASC',
  HasBorderAboveDesc = 'hasBorderAbove_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignup = Entry & {
  __typename?: 'EmailSignup'
  configuration?: Maybe<Scalars['JSON']>
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  formFieldsCollection?: Maybe<EmailSignupFormFieldsCollection>
  linkedFrom?: Maybe<EmailSignupLinkingCollections>
  signupType?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
  translations?: Maybe<Scalars['JSON']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupConfigurationArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupFormFieldsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupSignupTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/emailSignup) */
export type EmailSignupTranslationsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type EmailSignupCollection = {
  __typename?: 'EmailSignupCollection'
  items: Array<Maybe<EmailSignup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EmailSignupFilter = {
  AND?: InputMaybe<Array<InputMaybe<EmailSignupFilter>>>
  OR?: InputMaybe<Array<InputMaybe<EmailSignupFilter>>>
  configuration_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  formFieldsCollection_exists?: InputMaybe<Scalars['Boolean']>
  signupType?: InputMaybe<Scalars['String']>
  signupType_contains?: InputMaybe<Scalars['String']>
  signupType_exists?: InputMaybe<Scalars['Boolean']>
  signupType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  signupType_not?: InputMaybe<Scalars['String']>
  signupType_not_contains?: InputMaybe<Scalars['String']>
  signupType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  translations_exists?: InputMaybe<Scalars['Boolean']>
}

export type EmailSignupFormFieldsCollection = {
  __typename?: 'EmailSignupFormFieldsCollection'
  items: Array<Maybe<FormField>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EmailSignupLinkingCollections = {
  __typename?: 'EmailSignupLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type EmailSignupLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EmailSignupLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EmailSignupLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EmailSignupLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EmailSignupLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum EmailSignupOrder {
  SignupTypeAsc = 'signupType_ASC',
  SignupTypeDesc = 'signupType_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** YouTube or Vimeo [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/embeddedVideo) */
export type EmbeddedVideo = Entry & {
  __typename?: 'EmbeddedVideo'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<EmbeddedVideoLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

/** YouTube or Vimeo [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/embeddedVideo) */
export type EmbeddedVideoLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** YouTube or Vimeo [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/embeddedVideo) */
export type EmbeddedVideoTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** YouTube or Vimeo [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/embeddedVideo) */
export type EmbeddedVideoUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type EmbeddedVideoCollection = {
  __typename?: 'EmbeddedVideoCollection'
  items: Array<Maybe<EmbeddedVideo>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EmbeddedVideoFilter = {
  AND?: InputMaybe<Array<InputMaybe<EmbeddedVideoFilter>>>
  OR?: InputMaybe<Array<InputMaybe<EmbeddedVideoFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type EmbeddedVideoLinkingCollections = {
  __typename?: 'EmbeddedVideoLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type EmbeddedVideoLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum EmbeddedVideoOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAsset = Entry & {
  __typename?: 'EnhancedAsset'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  file?: Maybe<Asset>
  genericTagsCollection?: Maybe<EnhancedAssetGenericTagsCollection>
  linkedFrom?: Maybe<EnhancedAssetLinkingCollections>
  organization?: Maybe<Organization>
  releaseDate?: Maybe<Scalars['DateTime']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetFileArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetGenericTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetReleaseDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** An Asset that can be tagged with generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/enhancedAsset) */
export type EnhancedAssetTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type EnhancedAssetCollection = {
  __typename?: 'EnhancedAssetCollection'
  items: Array<Maybe<EnhancedAsset>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EnhancedAssetFilter = {
  AND?: InputMaybe<Array<InputMaybe<EnhancedAssetFilter>>>
  OR?: InputMaybe<Array<InputMaybe<EnhancedAssetFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  file_exists?: InputMaybe<Scalars['Boolean']>
  genericTagsCollection_exists?: InputMaybe<Scalars['Boolean']>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  releaseDate?: InputMaybe<Scalars['DateTime']>
  releaseDate_exists?: InputMaybe<Scalars['Boolean']>
  releaseDate_gt?: InputMaybe<Scalars['DateTime']>
  releaseDate_gte?: InputMaybe<Scalars['DateTime']>
  releaseDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  releaseDate_lt?: InputMaybe<Scalars['DateTime']>
  releaseDate_lte?: InputMaybe<Scalars['DateTime']>
  releaseDate_not?: InputMaybe<Scalars['DateTime']>
  releaseDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type EnhancedAssetGenericTagsCollection = {
  __typename?: 'EnhancedAssetGenericTagsCollection'
  items: Array<Maybe<GenericTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EnhancedAssetLinkingCollections = {
  __typename?: 'EnhancedAssetLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type EnhancedAssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum EnhancedAssetOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ReleaseDateAsc = 'releaseDate_ASC',
  ReleaseDateDesc = 'releaseDate_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type Entry = {
  contentfulMetadata: ContentfulMetadata
  sys: Sys
}

export type EntryCollection = {
  __typename?: 'EntryCollection'
  items: Array<Maybe<Entry>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EntryFilter = {
  AND?: InputMaybe<Array<InputMaybe<EntryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<EntryFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
}

export enum EntryOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/errorPage) */
export type ErrorPage = Entry & {
  __typename?: 'ErrorPage'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<ErrorPageDescription>
  errorCode?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<ErrorPageLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/errorPage) */
export type ErrorPageDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/errorPage) */
export type ErrorPageErrorCodeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/errorPage) */
export type ErrorPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/errorPage) */
export type ErrorPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ErrorPageCollection = {
  __typename?: 'ErrorPageCollection'
  items: Array<Maybe<ErrorPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ErrorPageDescription = {
  __typename?: 'ErrorPageDescription'
  json: Scalars['JSON']
  links: ErrorPageDescriptionLinks
}

export type ErrorPageDescriptionAssets = {
  __typename?: 'ErrorPageDescriptionAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type ErrorPageDescriptionEntries = {
  __typename?: 'ErrorPageDescriptionEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type ErrorPageDescriptionLinks = {
  __typename?: 'ErrorPageDescriptionLinks'
  assets: ErrorPageDescriptionAssets
  entries: ErrorPageDescriptionEntries
}

export type ErrorPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<ErrorPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ErrorPageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_not_contains?: InputMaybe<Scalars['String']>
  errorCode?: InputMaybe<Scalars['String']>
  errorCode_contains?: InputMaybe<Scalars['String']>
  errorCode_exists?: InputMaybe<Scalars['Boolean']>
  errorCode_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  errorCode_not?: InputMaybe<Scalars['String']>
  errorCode_not_contains?: InputMaybe<Scalars['String']>
  errorCode_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ErrorPageLinkingCollections = {
  __typename?: 'ErrorPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type ErrorPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ErrorPageOrder {
  ErrorCodeAsc = 'errorCode_ASC',
  ErrorCodeDesc = 'errorCode_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSlice = Entry & {
  __typename?: 'EventSlice'
  backgroundImage?: Maybe<Asset>
  contentfulMetadata: ContentfulMetadata
  date?: Maybe<Scalars['DateTime']>
  link?: Maybe<Link>
  linkedFrom?: Maybe<EventSliceLinkingCollections>
  subtitle?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSliceBackgroundImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSliceDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSliceLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSliceSubtitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/eventSlice) */
export type EventSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type EventSliceCollection = {
  __typename?: 'EventSliceCollection'
  items: Array<Maybe<EventSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type EventSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<EventSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<EventSliceFilter>>>
  backgroundImage_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  date?: InputMaybe<Scalars['DateTime']>
  date_exists?: InputMaybe<Scalars['Boolean']>
  date_gt?: InputMaybe<Scalars['DateTime']>
  date_gte?: InputMaybe<Scalars['DateTime']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  date_lt?: InputMaybe<Scalars['DateTime']>
  date_lte?: InputMaybe<Scalars['DateTime']>
  date_not?: InputMaybe<Scalars['DateTime']>
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  subtitle?: InputMaybe<Scalars['String']>
  subtitle_contains?: InputMaybe<Scalars['String']>
  subtitle_exists?: InputMaybe<Scalars['Boolean']>
  subtitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle_not?: InputMaybe<Scalars['String']>
  subtitle_not_contains?: InputMaybe<Scalars['String']>
  subtitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type EventSliceLinkingCollections = {
  __typename?: 'EventSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type EventSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EventSliceLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EventSliceLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EventSliceLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type EventSliceLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum EventSliceOrder {
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/faqList) */
export type FaqList = Entry & {
  __typename?: 'FaqList'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<FaqListLinkingCollections>
  questionsCollection?: Maybe<FaqListQuestionsCollection>
  showTitle?: Maybe<Scalars['Boolean']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/faqList) */
export type FaqListLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/faqList) */
export type FaqListQuestionsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/faqList) */
export type FaqListShowTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/faqList) */
export type FaqListTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type FaqListCollection = {
  __typename?: 'FaqListCollection'
  items: Array<Maybe<FaqList>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FaqListFilter = {
  AND?: InputMaybe<Array<InputMaybe<FaqListFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FaqListFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  questionsCollection_exists?: InputMaybe<Scalars['Boolean']>
  showTitle?: InputMaybe<Scalars['Boolean']>
  showTitle_exists?: InputMaybe<Scalars['Boolean']>
  showTitle_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FaqListLinkingCollections = {
  __typename?: 'FaqListLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type FaqListLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FaqListLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FaqListLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FaqListOrder {
  ShowTitleAsc = 'showTitle_ASC',
  ShowTitleDesc = 'showTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type FaqListQuestionsCollection = {
  __typename?: 'FaqListQuestionsCollection'
  items: Array<Maybe<QuestionAndAnswer>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featured) */
export type Featured = Entry & {
  __typename?: 'Featured'
  attention?: Maybe<Scalars['Boolean']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<FeaturedLinkingCollections>
  sys: Sys
  thing?: Maybe<FeaturedThing>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featured) */
export type FeaturedAttentionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featured) */
export type FeaturedLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featured) */
export type FeaturedThingArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featured) */
export type FeaturedTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticles = Entry & {
  __typename?: 'FeaturedArticles'
  articleCount?: Maybe<Scalars['Int']>
  articlesCollection?: Maybe<FeaturedArticlesArticlesCollection>
  automaticallyFetchArticles?: Maybe<Scalars['Boolean']>
  category?: Maybe<ArticleCategory>
  contentfulMetadata: ContentfulMetadata
  group?: Maybe<ArticleGroup>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  image?: Maybe<Asset>
  link?: Maybe<Link>
  linkedFrom?: Maybe<FeaturedArticlesLinkingCollections>
  organization?: Maybe<Organization>
  sortBy?: Maybe<Scalars['String']>
  subgroup?: Maybe<ArticleSubgroup>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesArticleCountArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesAutomaticallyFetchArticlesArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesGroupArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesHasBorderAboveArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesSortByArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesSubgroupArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/featuredArticles) */
export type FeaturedArticlesTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type FeaturedArticlesArticlesCollection = {
  __typename?: 'FeaturedArticlesArticlesCollection'
  items: Array<Maybe<Article>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FeaturedArticlesCollection = {
  __typename?: 'FeaturedArticlesCollection'
  items: Array<Maybe<FeaturedArticles>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FeaturedArticlesFilter = {
  AND?: InputMaybe<Array<InputMaybe<FeaturedArticlesFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FeaturedArticlesFilter>>>
  articleCount?: InputMaybe<Scalars['Int']>
  articleCount_exists?: InputMaybe<Scalars['Boolean']>
  articleCount_gt?: InputMaybe<Scalars['Int']>
  articleCount_gte?: InputMaybe<Scalars['Int']>
  articleCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  articleCount_lt?: InputMaybe<Scalars['Int']>
  articleCount_lte?: InputMaybe<Scalars['Int']>
  articleCount_not?: InputMaybe<Scalars['Int']>
  articleCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  articlesCollection_exists?: InputMaybe<Scalars['Boolean']>
  automaticallyFetchArticles?: InputMaybe<Scalars['Boolean']>
  automaticallyFetchArticles_exists?: InputMaybe<Scalars['Boolean']>
  automaticallyFetchArticles_not?: InputMaybe<Scalars['Boolean']>
  category?: InputMaybe<CfArticleCategoryNestedFilter>
  category_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  group?: InputMaybe<CfArticleGroupNestedFilter>
  group_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_not?: InputMaybe<Scalars['Boolean']>
  image_exists?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  sortBy?: InputMaybe<Scalars['String']>
  sortBy_contains?: InputMaybe<Scalars['String']>
  sortBy_exists?: InputMaybe<Scalars['Boolean']>
  sortBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sortBy_not?: InputMaybe<Scalars['String']>
  sortBy_not_contains?: InputMaybe<Scalars['String']>
  sortBy_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subgroup?: InputMaybe<CfArticleSubgroupNestedFilter>
  subgroup_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FeaturedArticlesLinkingCollections = {
  __typename?: 'FeaturedArticlesLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type FeaturedArticlesLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FeaturedArticlesLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FeaturedArticlesLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FeaturedArticlesLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FeaturedArticlesLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FeaturedArticlesOrder {
  ArticleCountAsc = 'articleCount_ASC',
  ArticleCountDesc = 'articleCount_DESC',
  AutomaticallyFetchArticlesAsc = 'automaticallyFetchArticles_ASC',
  AutomaticallyFetchArticlesDesc = 'automaticallyFetchArticles_DESC',
  HasBorderAboveAsc = 'hasBorderAbove_ASC',
  HasBorderAboveDesc = 'hasBorderAbove_DESC',
  SortByAsc = 'sortBy_ASC',
  SortByDesc = 'sortBy_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type FeaturedCollection = {
  __typename?: 'FeaturedCollection'
  items: Array<Maybe<Featured>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FeaturedFilter = {
  AND?: InputMaybe<Array<InputMaybe<FeaturedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FeaturedFilter>>>
  attention?: InputMaybe<Scalars['Boolean']>
  attention_exists?: InputMaybe<Scalars['Boolean']>
  attention_not?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  thing_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FeaturedLinkingCollections = {
  __typename?: 'FeaturedLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageCollection?: Maybe<FrontpageCollection>
}

export type FeaturedLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FeaturedLinkingCollectionsFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FeaturedOrder {
  AttentionAsc = 'attention_ASC',
  AttentionDesc = 'attention_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type FeaturedThing =
  | Article
  | LinkUrl
  | VidspyrnaFrontpage
  | VidspyrnaPage

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/footerItem) */
export type FooterItem = Entry & {
  __typename?: 'FooterItem'
  content?: Maybe<FooterItemContent>
  contentfulMetadata: ContentfulMetadata
  link?: Maybe<Link>
  linkedFrom?: Maybe<FooterItemLinkingCollections>
  serviceWebContent?: Maybe<FooterItemServiceWebContent>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/footerItem) */
export type FooterItemContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/footerItem) */
export type FooterItemLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/footerItem) */
export type FooterItemLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/footerItem) */
export type FooterItemServiceWebContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/footerItem) */
export type FooterItemTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type FooterItemCollection = {
  __typename?: 'FooterItemCollection'
  items: Array<Maybe<FooterItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FooterItemContent = {
  __typename?: 'FooterItemContent'
  json: Scalars['JSON']
  links: FooterItemContentLinks
}

export type FooterItemContentAssets = {
  __typename?: 'FooterItemContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type FooterItemContentEntries = {
  __typename?: 'FooterItemContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type FooterItemContentLinks = {
  __typename?: 'FooterItemContentLinks'
  assets: FooterItemContentAssets
  entries: FooterItemContentEntries
}

export type FooterItemFilter = {
  AND?: InputMaybe<Array<InputMaybe<FooterItemFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FooterItemFilter>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebContent_contains?: InputMaybe<Scalars['String']>
  serviceWebContent_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebContent_not_contains?: InputMaybe<Scalars['String']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FooterItemLinkingCollections = {
  __typename?: 'FooterItemLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationCollection?: Maybe<OrganizationCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type FooterItemLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FooterItemLinkingCollectionsOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FooterItemLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FooterItemLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FooterItemOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type FooterItemServiceWebContent = {
  __typename?: 'FooterItemServiceWebContent'
  json: Scalars['JSON']
  links: FooterItemServiceWebContentLinks
}

export type FooterItemServiceWebContentAssets = {
  __typename?: 'FooterItemServiceWebContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type FooterItemServiceWebContentEntries = {
  __typename?: 'FooterItemServiceWebContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type FooterItemServiceWebContentLinks = {
  __typename?: 'FooterItemServiceWebContentLinks'
  assets: FooterItemServiceWebContentAssets
  entries: FooterItemServiceWebContentEntries
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type Form = Entry & {
  __typename?: 'Form'
  aboutYouHeadingText?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  fieldsCollection?: Maybe<FormFieldsCollection>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<FormLinkingCollections>
  questionsHeadingText?: Maybe<Scalars['String']>
  recipient?: Maybe<Scalars['String']>
  recipientFormFieldDecider?: Maybe<FormField>
  successText?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormAboutYouHeadingTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormFieldsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormQuestionsHeadingTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormRecipientArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormRecipientFormFieldDeciderArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormSuccessTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/form) */
export type FormTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type FormCollection = {
  __typename?: 'FormCollection'
  items: Array<Maybe<Form>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormField = Entry & {
  __typename?: 'FormField'
  contentfulMetadata: ContentfulMetadata
  emailConfig?: Maybe<Scalars['JSON']>
  linkedFrom?: Maybe<FormFieldLinkingCollections>
  name?: Maybe<Scalars['String']>
  options?: Maybe<Array<Maybe<Scalars['String']>>>
  placeholder?: Maybe<Scalars['String']>
  required?: Maybe<Scalars['Boolean']>
  sys: Sys
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldEmailConfigArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldNameArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldOptionsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldPlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldRequiredArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/formField) */
export type FormFieldTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type FormFieldCollection = {
  __typename?: 'FormFieldCollection'
  items: Array<Maybe<FormField>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FormFieldFilter = {
  AND?: InputMaybe<Array<InputMaybe<FormFieldFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FormFieldFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  emailConfig_exists?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_exists?: InputMaybe<Scalars['Boolean']>
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_exists?: InputMaybe<Scalars['Boolean']>
  placeholder?: InputMaybe<Scalars['String']>
  placeholder_contains?: InputMaybe<Scalars['String']>
  placeholder_exists?: InputMaybe<Scalars['Boolean']>
  placeholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  placeholder_not?: InputMaybe<Scalars['String']>
  placeholder_not_contains?: InputMaybe<Scalars['String']>
  placeholder_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  required?: InputMaybe<Scalars['Boolean']>
  required_exists?: InputMaybe<Scalars['Boolean']>
  required_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FormFieldLinkingCollections = {
  __typename?: 'FormFieldLinkingCollections'
  emailSignupCollection?: Maybe<EmailSignupCollection>
  entryCollection?: Maybe<EntryCollection>
  formCollection?: Maybe<FormCollection>
}

export type FormFieldLinkingCollectionsEmailSignupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FormFieldLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FormFieldLinkingCollectionsFormCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FormFieldOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PlaceholderAsc = 'placeholder_ASC',
  PlaceholderDesc = 'placeholder_DESC',
  RequiredAsc = 'required_ASC',
  RequiredDesc = 'required_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type FormFieldsCollection = {
  __typename?: 'FormFieldsCollection'
  items: Array<Maybe<FormField>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FormFilter = {
  AND?: InputMaybe<Array<InputMaybe<FormFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FormFilter>>>
  aboutYouHeadingText?: InputMaybe<Scalars['String']>
  aboutYouHeadingText_contains?: InputMaybe<Scalars['String']>
  aboutYouHeadingText_exists?: InputMaybe<Scalars['Boolean']>
  aboutYouHeadingText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  aboutYouHeadingText_not?: InputMaybe<Scalars['String']>
  aboutYouHeadingText_not_contains?: InputMaybe<Scalars['String']>
  aboutYouHeadingText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  fieldsCollection_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  questionsHeadingText?: InputMaybe<Scalars['String']>
  questionsHeadingText_contains?: InputMaybe<Scalars['String']>
  questionsHeadingText_exists?: InputMaybe<Scalars['Boolean']>
  questionsHeadingText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  questionsHeadingText_not?: InputMaybe<Scalars['String']>
  questionsHeadingText_not_contains?: InputMaybe<Scalars['String']>
  questionsHeadingText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  recipient?: InputMaybe<Scalars['String']>
  recipientFormFieldDecider?: InputMaybe<CfFormFieldNestedFilter>
  recipientFormFieldDecider_exists?: InputMaybe<Scalars['Boolean']>
  recipient_contains?: InputMaybe<Scalars['String']>
  recipient_exists?: InputMaybe<Scalars['Boolean']>
  recipient_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  recipient_not?: InputMaybe<Scalars['String']>
  recipient_not_contains?: InputMaybe<Scalars['String']>
  recipient_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  successText?: InputMaybe<Scalars['String']>
  successText_contains?: InputMaybe<Scalars['String']>
  successText_exists?: InputMaybe<Scalars['Boolean']>
  successText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  successText_not?: InputMaybe<Scalars['String']>
  successText_not_contains?: InputMaybe<Scalars['String']>
  successText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FormLinkingCollections = {
  __typename?: 'FormLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type FormLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FormOrder {
  AboutYouHeadingTextAsc = 'aboutYouHeadingText_ASC',
  AboutYouHeadingTextDesc = 'aboutYouHeadingText_DESC',
  QuestionsHeadingTextAsc = 'questionsHeadingText_ASC',
  QuestionsHeadingTextDesc = 'questionsHeadingText_DESC',
  RecipientAsc = 'recipient_ASC',
  RecipientDesc = 'recipient_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type Frontpage = Entry & {
  __typename?: 'Frontpage'
  contentfulMetadata: ContentfulMetadata
  featuredCollection?: Maybe<FrontpageFeaturedCollection>
  heading?: Maybe<Scalars['String']>
  image?: Maybe<Asset>
  imageAlternativeText?: Maybe<Scalars['String']>
  imageMobile?: Maybe<Asset>
  lifeEventsCollection?: Maybe<FrontpageLifeEventsCollection>
  linkList?: Maybe<LinkList>
  linkedFrom?: Maybe<FrontpageLinkingCollections>
  namespace?: Maybe<UiConfiguration>
  pageIdentifier?: Maybe<Scalars['String']>
  slidesCollection?: Maybe<FrontpageSlidesCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
  videosCollection?: Maybe<AssetCollection>
  videosMobileCollection?: Maybe<AssetCollection>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageHeadingArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageImageAlternativeTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageImageMobileArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageLifeEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageLinkListArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageNamespaceArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpagePageIdentifierArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageSlidesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageVideosCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/**
 * This is the frontpage for Island.is.
 * Contains life events, frontpage sliders, featured, etc... [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpage)
 */
export type FrontpageVideosMobileCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FrontpageCollection = {
  __typename?: 'FrontpageCollection'
  items: Array<Maybe<Frontpage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FrontpageFeaturedCollection = {
  __typename?: 'FrontpageFeaturedCollection'
  items: Array<Maybe<Featured>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FrontpageFilter = {
  AND?: InputMaybe<Array<InputMaybe<FrontpageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FrontpageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  featuredCollection_exists?: InputMaybe<Scalars['Boolean']>
  heading?: InputMaybe<Scalars['String']>
  heading_contains?: InputMaybe<Scalars['String']>
  heading_exists?: InputMaybe<Scalars['Boolean']>
  heading_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  heading_not?: InputMaybe<Scalars['String']>
  heading_not_contains?: InputMaybe<Scalars['String']>
  heading_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  imageAlternativeText?: InputMaybe<Scalars['String']>
  imageAlternativeText_contains?: InputMaybe<Scalars['String']>
  imageAlternativeText_exists?: InputMaybe<Scalars['Boolean']>
  imageAlternativeText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  imageAlternativeText_not?: InputMaybe<Scalars['String']>
  imageAlternativeText_not_contains?: InputMaybe<Scalars['String']>
  imageAlternativeText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  imageMobile_exists?: InputMaybe<Scalars['Boolean']>
  image_exists?: InputMaybe<Scalars['Boolean']>
  lifeEventsCollection_exists?: InputMaybe<Scalars['Boolean']>
  linkList?: InputMaybe<CfLinkListNestedFilter>
  linkList_exists?: InputMaybe<Scalars['Boolean']>
  namespace?: InputMaybe<CfUiConfigurationNestedFilter>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  pageIdentifier?: InputMaybe<Scalars['String']>
  pageIdentifier_contains?: InputMaybe<Scalars['String']>
  pageIdentifier_exists?: InputMaybe<Scalars['Boolean']>
  pageIdentifier_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageIdentifier_not?: InputMaybe<Scalars['String']>
  pageIdentifier_not_contains?: InputMaybe<Scalars['String']>
  pageIdentifier_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slidesCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  videosCollection_exists?: InputMaybe<Scalars['Boolean']>
  videosMobileCollection_exists?: InputMaybe<Scalars['Boolean']>
}

export type FrontpageLifeEventsCollection = {
  __typename?: 'FrontpageLifeEventsCollection'
  items: Array<Maybe<LifeEventPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FrontpageLinkingCollections = {
  __typename?: 'FrontpageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type FrontpageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FrontpageOrder {
  HeadingAsc = 'heading_ASC',
  HeadingDesc = 'heading_DESC',
  ImageAlternativeTextAsc = 'imageAlternativeText_ASC',
  ImageAlternativeTextDesc = 'imageAlternativeText_DESC',
  PageIdentifierAsc = 'pageIdentifier_ASC',
  PageIdentifierDesc = 'pageIdentifier_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSlider = Entry & {
  __typename?: 'FrontpageSlider'
  animationJson?: Maybe<Scalars['JSON']>
  animationJsonAsset?: Maybe<Asset>
  animationJsonFile?: Maybe<Asset>
  content?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  intro?: Maybe<FrontpageSliderIntro>
  link?: Maybe<FrontpageSliderLink>
  linkedFrom?: Maybe<FrontpageSliderLinkingCollections>
  slideLink?: Maybe<Link>
  subtitle?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderAnimationJsonArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderAnimationJsonAssetArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderAnimationJsonFileArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderSlideLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderSubtitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Efni í haus á forsíðu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/frontpageSlider) */
export type FrontpageSliderTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type FrontpageSliderCollection = {
  __typename?: 'FrontpageSliderCollection'
  items: Array<Maybe<FrontpageSlider>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type FrontpageSliderFilter = {
  AND?: InputMaybe<Array<InputMaybe<FrontpageSliderFilter>>>
  OR?: InputMaybe<Array<InputMaybe<FrontpageSliderFilter>>>
  animationJsonAsset_exists?: InputMaybe<Scalars['Boolean']>
  animationJsonFile_exists?: InputMaybe<Scalars['Boolean']>
  animationJson_exists?: InputMaybe<Scalars['Boolean']>
  content?: InputMaybe<Scalars['String']>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  content_not?: InputMaybe<Scalars['String']>
  content_not_contains?: InputMaybe<Scalars['String']>
  content_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  slideLink?: InputMaybe<CfLinkNestedFilter>
  slideLink_exists?: InputMaybe<Scalars['Boolean']>
  subtitle?: InputMaybe<Scalars['String']>
  subtitle_contains?: InputMaybe<Scalars['String']>
  subtitle_exists?: InputMaybe<Scalars['Boolean']>
  subtitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle_not?: InputMaybe<Scalars['String']>
  subtitle_not_contains?: InputMaybe<Scalars['String']>
  subtitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type FrontpageSliderIntro = {
  __typename?: 'FrontpageSliderIntro'
  json: Scalars['JSON']
  links: FrontpageSliderIntroLinks
}

export type FrontpageSliderIntroAssets = {
  __typename?: 'FrontpageSliderIntroAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type FrontpageSliderIntroEntries = {
  __typename?: 'FrontpageSliderIntroEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type FrontpageSliderIntroLinks = {
  __typename?: 'FrontpageSliderIntroLinks'
  assets: FrontpageSliderIntroAssets
  entries: FrontpageSliderIntroEntries
}

export type FrontpageSliderLink =
  | Article
  | ArticleCategory
  | News
  | Organization
  | OrganizationPage
  | VidspyrnaFrontpage

export type FrontpageSliderLinkingCollections = {
  __typename?: 'FrontpageSliderLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageCollection?: Maybe<FrontpageCollection>
}

export type FrontpageSliderLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type FrontpageSliderLinkingCollectionsFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum FrontpageSliderOrder {
  ContentAsc = 'content_ASC',
  ContentDesc = 'content_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type FrontpageSlidesCollection = {
  __typename?: 'FrontpageSlidesCollection'
  items: Array<Maybe<FrontpageSlider>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPage = Entry & {
  __typename?: 'GenericOverviewPage'
  contentfulMetadata: ContentfulMetadata
  intro?: Maybe<GenericOverviewPageIntro>
  linkedFrom?: Maybe<GenericOverviewPageLinkingCollections>
  navigation?: Maybe<Menu>
  overviewLinksCollection?: Maybe<GenericOverviewPageOverviewLinksCollection>
  pageIdentifier?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPageNavigationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPageOverviewLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPagePageIdentifierArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericOverviewPage) */
export type GenericOverviewPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type GenericOverviewPageCollection = {
  __typename?: 'GenericOverviewPageCollection'
  items: Array<Maybe<GenericOverviewPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type GenericOverviewPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<GenericOverviewPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<GenericOverviewPageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  navigation?: InputMaybe<CfMenuNestedFilter>
  navigation_exists?: InputMaybe<Scalars['Boolean']>
  overviewLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  pageIdentifier?: InputMaybe<Scalars['String']>
  pageIdentifier_contains?: InputMaybe<Scalars['String']>
  pageIdentifier_exists?: InputMaybe<Scalars['Boolean']>
  pageIdentifier_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageIdentifier_not?: InputMaybe<Scalars['String']>
  pageIdentifier_not_contains?: InputMaybe<Scalars['String']>
  pageIdentifier_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type GenericOverviewPageIntro = {
  __typename?: 'GenericOverviewPageIntro'
  json: Scalars['JSON']
  links: GenericOverviewPageIntroLinks
}

export type GenericOverviewPageIntroAssets = {
  __typename?: 'GenericOverviewPageIntroAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type GenericOverviewPageIntroEntries = {
  __typename?: 'GenericOverviewPageIntroEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type GenericOverviewPageIntroLinks = {
  __typename?: 'GenericOverviewPageIntroLinks'
  assets: GenericOverviewPageIntroAssets
  entries: GenericOverviewPageIntroEntries
}

export type GenericOverviewPageLinkingCollections = {
  __typename?: 'GenericOverviewPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type GenericOverviewPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum GenericOverviewPageOrder {
  PageIdentifierAsc = 'pageIdentifier_ASC',
  PageIdentifierDesc = 'pageIdentifier_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type GenericOverviewPageOverviewLinksCollection = {
  __typename?: 'GenericOverviewPageOverviewLinksCollection'
  items: Array<Maybe<IntroLinkImage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPage = Entry & {
  __typename?: 'GenericPage'
  contentfulMetadata: ContentfulMetadata
  intro?: Maybe<GenericPageIntro>
  linkedFrom?: Maybe<GenericPageLinkingCollections>
  mainContent?: Maybe<GenericPageMainContent>
  misc?: Maybe<Scalars['JSON']>
  sidebar?: Maybe<GenericPageSidebar>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageMainContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageMiscArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageSidebarArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Generic content page with optional sidebar [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericPage) */
export type GenericPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type GenericPageCollection = {
  __typename?: 'GenericPageCollection'
  items: Array<Maybe<GenericPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type GenericPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<GenericPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<GenericPageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  mainContent_contains?: InputMaybe<Scalars['String']>
  mainContent_exists?: InputMaybe<Scalars['Boolean']>
  mainContent_not_contains?: InputMaybe<Scalars['String']>
  misc_exists?: InputMaybe<Scalars['Boolean']>
  sidebar_contains?: InputMaybe<Scalars['String']>
  sidebar_exists?: InputMaybe<Scalars['Boolean']>
  sidebar_not_contains?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type GenericPageIntro = {
  __typename?: 'GenericPageIntro'
  json: Scalars['JSON']
  links: GenericPageIntroLinks
}

export type GenericPageIntroAssets = {
  __typename?: 'GenericPageIntroAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type GenericPageIntroEntries = {
  __typename?: 'GenericPageIntroEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type GenericPageIntroLinks = {
  __typename?: 'GenericPageIntroLinks'
  assets: GenericPageIntroAssets
  entries: GenericPageIntroEntries
}

export type GenericPageLinkingCollections = {
  __typename?: 'GenericPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type GenericPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericPageMainContent = {
  __typename?: 'GenericPageMainContent'
  json: Scalars['JSON']
  links: GenericPageMainContentLinks
}

export type GenericPageMainContentAssets = {
  __typename?: 'GenericPageMainContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type GenericPageMainContentEntries = {
  __typename?: 'GenericPageMainContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type GenericPageMainContentLinks = {
  __typename?: 'GenericPageMainContentLinks'
  assets: GenericPageMainContentAssets
  entries: GenericPageMainContentEntries
}

export enum GenericPageOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type GenericPageSidebar = {
  __typename?: 'GenericPageSidebar'
  json: Scalars['JSON']
  links: GenericPageSidebarLinks
}

export type GenericPageSidebarAssets = {
  __typename?: 'GenericPageSidebarAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type GenericPageSidebarEntries = {
  __typename?: 'GenericPageSidebarEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type GenericPageSidebarLinks = {
  __typename?: 'GenericPageSidebarLinks'
  assets: GenericPageSidebarAssets
  entries: GenericPageSidebarEntries
}

/** A generic uniquely named tag that can be used to tag miscellaneous things. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTag) */
export type GenericTag = Entry & {
  __typename?: 'GenericTag'
  contentfulMetadata: ContentfulMetadata
  genericTagGroup?: Maybe<GenericTagGroup>
  linkedFrom?: Maybe<GenericTagLinkingCollections>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** A generic uniquely named tag that can be used to tag miscellaneous things. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTag) */
export type GenericTagGenericTagGroupArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** A generic uniquely named tag that can be used to tag miscellaneous things. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTag) */
export type GenericTagLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A generic uniquely named tag that can be used to tag miscellaneous things. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTag) */
export type GenericTagSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A generic uniquely named tag that can be used to tag miscellaneous things. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTag) */
export type GenericTagTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type GenericTagCollection = {
  __typename?: 'GenericTagCollection'
  items: Array<Maybe<GenericTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type GenericTagFilter = {
  AND?: InputMaybe<Array<InputMaybe<GenericTagFilter>>>
  OR?: InputMaybe<Array<InputMaybe<GenericTagFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  genericTagGroup?: InputMaybe<CfGenericTagGroupNestedFilter>
  genericTagGroup_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A way to group together generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTagGroup) */
export type GenericTagGroup = Entry & {
  __typename?: 'GenericTagGroup'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<GenericTagGroupLinkingCollections>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** A way to group together generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTagGroup) */
export type GenericTagGroupLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A way to group together generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTagGroup) */
export type GenericTagGroupSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A way to group together generic tags [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/genericTagGroup) */
export type GenericTagGroupTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type GenericTagGroupCollection = {
  __typename?: 'GenericTagGroupCollection'
  items: Array<Maybe<GenericTagGroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type GenericTagGroupFilter = {
  AND?: InputMaybe<Array<InputMaybe<GenericTagGroupFilter>>>
  OR?: InputMaybe<Array<InputMaybe<GenericTagGroupFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type GenericTagGroupLinkingCollections = {
  __typename?: 'GenericTagGroupLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  genericTagCollection?: Maybe<GenericTagCollection>
}

export type GenericTagGroupLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagGroupLinkingCollectionsGenericTagCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum GenericTagGroupOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type GenericTagLinkingCollections = {
  __typename?: 'GenericTagLinkingCollections'
  enhancedAssetCollection?: Maybe<EnhancedAssetCollection>
  entryCollection?: Maybe<EntryCollection>
  latestNewsSliceCollection?: Maybe<LatestNewsSliceCollection>
  newsCollection?: Maybe<NewsCollection>
  organizationCollection?: Maybe<OrganizationCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type GenericTagLinkingCollectionsEnhancedAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagLinkingCollectionsLatestNewsSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagLinkingCollectionsNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagLinkingCollectionsOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GenericTagLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum GenericTagOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCard = Entry & {
  __typename?: 'GraphCard'
  contentfulMetadata: ContentfulMetadata
  data?: Maybe<Scalars['JSON']>
  datakeys?: Maybe<Scalars['JSON']>
  displayAsCard?: Maybe<Scalars['Boolean']>
  graphDescription?: Maybe<Scalars['String']>
  graphTitle?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<GraphCardLinkingCollections>
  organization?: Maybe<Scalars['String']>
  organizationLogo?: Maybe<Asset>
  sys: Sys
  type?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardDataArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardDatakeysArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardDisplayAsCardArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardGraphDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardGraphTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardOrganizationLogoArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/graphCard) */
export type GraphCardTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type GraphCardCollection = {
  __typename?: 'GraphCardCollection'
  items: Array<Maybe<GraphCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type GraphCardFilter = {
  AND?: InputMaybe<Array<InputMaybe<GraphCardFilter>>>
  OR?: InputMaybe<Array<InputMaybe<GraphCardFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  data_exists?: InputMaybe<Scalars['Boolean']>
  datakeys_exists?: InputMaybe<Scalars['Boolean']>
  displayAsCard?: InputMaybe<Scalars['Boolean']>
  displayAsCard_exists?: InputMaybe<Scalars['Boolean']>
  displayAsCard_not?: InputMaybe<Scalars['Boolean']>
  graphDescription?: InputMaybe<Scalars['String']>
  graphDescription_contains?: InputMaybe<Scalars['String']>
  graphDescription_exists?: InputMaybe<Scalars['Boolean']>
  graphDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphDescription_not?: InputMaybe<Scalars['String']>
  graphDescription_not_contains?: InputMaybe<Scalars['String']>
  graphDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphTitle?: InputMaybe<Scalars['String']>
  graphTitle_contains?: InputMaybe<Scalars['String']>
  graphTitle_exists?: InputMaybe<Scalars['Boolean']>
  graphTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphTitle_not?: InputMaybe<Scalars['String']>
  graphTitle_not_contains?: InputMaybe<Scalars['String']>
  graphTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organization?: InputMaybe<Scalars['String']>
  organizationLogo_exists?: InputMaybe<Scalars['Boolean']>
  organization_contains?: InputMaybe<Scalars['String']>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  organization_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organization_not?: InputMaybe<Scalars['String']>
  organization_not_contains?: InputMaybe<Scalars['String']>
  organization_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type GraphCardLinkingCollections = {
  __typename?: 'GraphCardLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  openDataPageCollection?: Maybe<OpenDataPageCollection>
  openDataSubpageCollection?: Maybe<OpenDataSubpageCollection>
}

export type GraphCardLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GraphCardLinkingCollectionsOpenDataPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GraphCardLinkingCollectionsOpenDataSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum GraphCardOrder {
  DisplayAsCardAsc = 'displayAsCard_ASC',
  DisplayAsCardDesc = 'displayAsCard_DESC',
  GraphDescriptionAsc = 'graphDescription_ASC',
  GraphDescriptionDesc = 'graphDescription_DESC',
  GraphTitleAsc = 'graphTitle_ASC',
  GraphTitleDesc = 'graphTitle_DESC',
  OrganizationAsc = 'organization_ASC',
  OrganizationDesc = 'organization_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** Includes multiple menu groups for complex menu structures such as footers or mega menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/groupedMenu) */
export type GroupedMenu = Entry & {
  __typename?: 'GroupedMenu'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<GroupedMenuLinkingCollections>
  menusCollection?: Maybe<GroupedMenuMenusCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Includes multiple menu groups for complex menu structures such as footers or mega menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/groupedMenu) */
export type GroupedMenuLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Includes multiple menu groups for complex menu structures such as footers or mega menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/groupedMenu) */
export type GroupedMenuMenusCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Includes multiple menu groups for complex menu structures such as footers or mega menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/groupedMenu) */
export type GroupedMenuTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type GroupedMenuCollection = {
  __typename?: 'GroupedMenuCollection'
  items: Array<Maybe<GroupedMenu>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type GroupedMenuFilter = {
  AND?: InputMaybe<Array<InputMaybe<GroupedMenuFilter>>>
  OR?: InputMaybe<Array<InputMaybe<GroupedMenuFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  menusCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type GroupedMenuLinkingCollections = {
  __typename?: 'GroupedMenuLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type GroupedMenuLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type GroupedMenuMenusCollection = {
  __typename?: 'GroupedMenuMenusCollection'
  items: Array<Maybe<Menu>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum GroupedMenuOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplate = Entry & {
  __typename?: 'HnippTemplate'
  args?: Maybe<Array<Maybe<Scalars['String']>>>
  category?: Maybe<Scalars['String']>
  clickAction?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<HnippTemplateLinkingCollections>
  notificationBody?: Maybe<Scalars['String']>
  notificationDataCopy?: Maybe<Scalars['String']>
  notificationTitle?: Maybe<Scalars['String']>
  organization?: Maybe<Organization>
  sys: Sys
  templateId?: Maybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateArgsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateClickActionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateNotificationBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateNotificationDataCopyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateNotificationTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** push notification templates for island.is [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/hnippTemplate) */
export type HnippTemplateTemplateIdArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type HnippTemplateCollection = {
  __typename?: 'HnippTemplateCollection'
  items: Array<Maybe<HnippTemplate>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type HnippTemplateFilter = {
  AND?: InputMaybe<Array<InputMaybe<HnippTemplateFilter>>>
  OR?: InputMaybe<Array<InputMaybe<HnippTemplateFilter>>>
  args_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  args_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  args_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  args_exists?: InputMaybe<Scalars['Boolean']>
  category?: InputMaybe<Scalars['String']>
  category_contains?: InputMaybe<Scalars['String']>
  category_exists?: InputMaybe<Scalars['Boolean']>
  category_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  category_not?: InputMaybe<Scalars['String']>
  category_not_contains?: InputMaybe<Scalars['String']>
  category_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  clickAction?: InputMaybe<Scalars['String']>
  clickAction_contains?: InputMaybe<Scalars['String']>
  clickAction_exists?: InputMaybe<Scalars['Boolean']>
  clickAction_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  clickAction_not?: InputMaybe<Scalars['String']>
  clickAction_not_contains?: InputMaybe<Scalars['String']>
  clickAction_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  notificationBody?: InputMaybe<Scalars['String']>
  notificationBody_contains?: InputMaybe<Scalars['String']>
  notificationBody_exists?: InputMaybe<Scalars['Boolean']>
  notificationBody_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  notificationBody_not?: InputMaybe<Scalars['String']>
  notificationBody_not_contains?: InputMaybe<Scalars['String']>
  notificationBody_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  notificationDataCopy?: InputMaybe<Scalars['String']>
  notificationDataCopy_contains?: InputMaybe<Scalars['String']>
  notificationDataCopy_exists?: InputMaybe<Scalars['Boolean']>
  notificationDataCopy_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  notificationDataCopy_not?: InputMaybe<Scalars['String']>
  notificationDataCopy_not_contains?: InputMaybe<Scalars['String']>
  notificationDataCopy_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  notificationTitle?: InputMaybe<Scalars['String']>
  notificationTitle_contains?: InputMaybe<Scalars['String']>
  notificationTitle_exists?: InputMaybe<Scalars['Boolean']>
  notificationTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  notificationTitle_not?: InputMaybe<Scalars['String']>
  notificationTitle_not_contains?: InputMaybe<Scalars['String']>
  notificationTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  templateId?: InputMaybe<Scalars['String']>
  templateId_contains?: InputMaybe<Scalars['String']>
  templateId_exists?: InputMaybe<Scalars['Boolean']>
  templateId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  templateId_not?: InputMaybe<Scalars['String']>
  templateId_not_contains?: InputMaybe<Scalars['String']>
  templateId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type HnippTemplateLinkingCollections = {
  __typename?: 'HnippTemplateLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type HnippTemplateLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum HnippTemplateOrder {
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  ClickActionAsc = 'clickAction_ASC',
  ClickActionDesc = 'clickAction_DESC',
  NotificationBodyAsc = 'notificationBody_ASC',
  NotificationBodyDesc = 'notificationBody_DESC',
  NotificationDataCopyAsc = 'notificationDataCopy_ASC',
  NotificationDataCopyDesc = 'notificationDataCopy_DESC',
  NotificationTitleAsc = 'notificationTitle_ASC',
  NotificationTitleDesc = 'notificationTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TemplateIdAsc = 'templateId_ASC',
  TemplateIdDesc = 'templateId_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBullet = Entry & {
  __typename?: 'IconBullet'
  body?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  icon?: Maybe<Asset>
  linkText?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<IconBulletLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBulletBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBulletIconArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBulletLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBulletLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBulletTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/iconBullet) */
export type IconBulletUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type IconBulletCollection = {
  __typename?: 'IconBulletCollection'
  items: Array<Maybe<IconBullet>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type IconBulletFilter = {
  AND?: InputMaybe<Array<InputMaybe<IconBulletFilter>>>
  OR?: InputMaybe<Array<InputMaybe<IconBulletFilter>>>
  body?: InputMaybe<Scalars['String']>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  body_not?: InputMaybe<Scalars['String']>
  body_not_contains?: InputMaybe<Scalars['String']>
  body_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  icon_exists?: InputMaybe<Scalars['Boolean']>
  linkText?: InputMaybe<Scalars['String']>
  linkText_contains?: InputMaybe<Scalars['String']>
  linkText_exists?: InputMaybe<Scalars['Boolean']>
  linkText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkText_not?: InputMaybe<Scalars['String']>
  linkText_not_contains?: InputMaybe<Scalars['String']>
  linkText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type IconBulletLinkingCollections = {
  __typename?: 'IconBulletLinkingCollections'
  bigBulletListCollection?: Maybe<BigBulletListCollection>
  entryCollection?: Maybe<EntryCollection>
}

export type IconBulletLinkingCollectionsBigBulletListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type IconBulletLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum IconBulletOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

export enum ImageFormat {
  Avif = 'AVIF',
  /** JPG image format. */
  Jpg = 'JPG',
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  JpgProgressive = 'JPG_PROGRESSIVE',
  /** PNG image format */
  Png = 'PNG',
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  Png8 = 'PNG8',
  /** WebP image format. */
  Webp = 'WEBP',
}

export enum ImageResizeFocus {
  /** Focus the resizing on the bottom. */
  Bottom = 'BOTTOM',
  /** Focus the resizing on the bottom left. */
  BottomLeft = 'BOTTOM_LEFT',
  /** Focus the resizing on the bottom right. */
  BottomRight = 'BOTTOM_RIGHT',
  /** Focus the resizing on the center. */
  Center = 'CENTER',
  /** Focus the resizing on the largest face. */
  Face = 'FACE',
  /** Focus the resizing on the area containing all the faces. */
  Faces = 'FACES',
  /** Focus the resizing on the left. */
  Left = 'LEFT',
  /** Focus the resizing on the right. */
  Right = 'RIGHT',
  /** Focus the resizing on the top. */
  Top = 'TOP',
  /** Focus the resizing on the top left. */
  TopLeft = 'TOP_LEFT',
  /** Focus the resizing on the top right. */
  TopRight = 'TOP_RIGHT',
}

export enum ImageResizeStrategy {
  /** Crops a part of the original image to fit into the specified dimensions. */
  Crop = 'CROP',
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  Fill = 'FILL',
  /** Resizes the image to fit into the specified dimensions. */
  Fit = 'FIT',
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  Pad = 'PAD',
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  Scale = 'SCALE',
  /** Creates a thumbnail from the image. */
  Thumb = 'THUMB',
}

export type ImageTransformOptions = {
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: InputMaybe<Scalars['HexColor']>
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: InputMaybe<Scalars['Int']>
  /** Desired image format. Defaults to the original image format. */
  format?: InputMaybe<ImageFormat>
  /** Desired height in pixels. Defaults to the original image height. */
  height?: InputMaybe<Scalars['Dimension']>
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: InputMaybe<Scalars['Quality']>
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: InputMaybe<ImageResizeFocus>
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: InputMaybe<ImageResizeStrategy>
  /** Desired width in pixels. Defaults to the original image width. */
  width?: InputMaybe<Scalars['Dimension']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImage = Entry & {
  __typename?: 'IntroLinkImage'
  contentfulMetadata: ContentfulMetadata
  image?: Maybe<Asset>
  intro?: Maybe<IntroLinkImageIntro>
  leftImage?: Maybe<Scalars['Boolean']>
  link?: Maybe<IntroLinkImageLink>
  linkTitle?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<IntroLinkImageLinkingCollections>
  openLinkInNewTab?: Maybe<Scalars['Boolean']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageLeftImageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageLinkTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageOpenLinkInNewTabArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/introLinkImage) */
export type IntroLinkImageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type IntroLinkImageCollection = {
  __typename?: 'IntroLinkImageCollection'
  items: Array<Maybe<IntroLinkImage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type IntroLinkImageFilter = {
  AND?: InputMaybe<Array<InputMaybe<IntroLinkImageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<IntroLinkImageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  image_exists?: InputMaybe<Scalars['Boolean']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  leftImage?: InputMaybe<Scalars['Boolean']>
  leftImage_exists?: InputMaybe<Scalars['Boolean']>
  leftImage_not?: InputMaybe<Scalars['Boolean']>
  linkTitle?: InputMaybe<Scalars['String']>
  linkTitle_contains?: InputMaybe<Scalars['String']>
  linkTitle_exists?: InputMaybe<Scalars['Boolean']>
  linkTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkTitle_not?: InputMaybe<Scalars['String']>
  linkTitle_not_contains?: InputMaybe<Scalars['String']>
  linkTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_exists?: InputMaybe<Scalars['Boolean']>
  openLinkInNewTab?: InputMaybe<Scalars['Boolean']>
  openLinkInNewTab_exists?: InputMaybe<Scalars['Boolean']>
  openLinkInNewTab_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type IntroLinkImageIntro = {
  __typename?: 'IntroLinkImageIntro'
  json: Scalars['JSON']
  links: IntroLinkImageIntroLinks
}

export type IntroLinkImageIntroAssets = {
  __typename?: 'IntroLinkImageIntroAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type IntroLinkImageIntroEntries = {
  __typename?: 'IntroLinkImageIntroEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type IntroLinkImageIntroLinks = {
  __typename?: 'IntroLinkImageIntroLinks'
  assets: IntroLinkImageIntroAssets
  entries: IntroLinkImageIntroEntries
}

export type IntroLinkImageLink =
  | Article
  | ArticleCategory
  | LifeEventPage
  | LinkUrl
  | News
  | SubArticle
  | VidspyrnaFrontpage
  | VidspyrnaPage

export type IntroLinkImageLinkingCollections = {
  __typename?: 'IntroLinkImageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  genericOverviewPageCollection?: Maybe<GenericOverviewPageCollection>
  overviewLinksCollection?: Maybe<OverviewLinksCollection>
}

export type IntroLinkImageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type IntroLinkImageLinkingCollectionsGenericOverviewPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type IntroLinkImageLinkingCollectionsOverviewLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum IntroLinkImageOrder {
  LeftImageAsc = 'leftImage_ASC',
  LeftImageDesc = 'leftImage_DESC',
  LinkTitleAsc = 'linkTitle_ASC',
  LinkTitleDesc = 'linkTitle_DESC',
  OpenLinkInNewTabAsc = 'openLinkInNewTab_ASC',
  OpenLinkInNewTabDesc = 'openLinkInNewTab_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** Slice to show latest news entries [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/latestNewsSlice) */
export type LatestNewsSlice = Entry & {
  __typename?: 'LatestNewsSlice'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<LatestNewsSliceLinkingCollections>
  newsTag?: Maybe<GenericTag>
  readMoreLink?: Maybe<Link>
  readMoreText?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Slice to show latest news entries [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/latestNewsSlice) */
export type LatestNewsSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Slice to show latest news entries [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/latestNewsSlice) */
export type LatestNewsSliceNewsTagArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Slice to show latest news entries [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/latestNewsSlice) */
export type LatestNewsSliceReadMoreLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Slice to show latest news entries [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/latestNewsSlice) */
export type LatestNewsSliceReadMoreTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Slice to show latest news entries [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/latestNewsSlice) */
export type LatestNewsSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LatestNewsSliceCollection = {
  __typename?: 'LatestNewsSliceCollection'
  items: Array<Maybe<LatestNewsSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LatestNewsSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<LatestNewsSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LatestNewsSliceFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  newsTag?: InputMaybe<CfGenericTagNestedFilter>
  newsTag_exists?: InputMaybe<Scalars['Boolean']>
  readMoreLink?: InputMaybe<CfLinkNestedFilter>
  readMoreLink_exists?: InputMaybe<Scalars['Boolean']>
  readMoreText?: InputMaybe<Scalars['String']>
  readMoreText_contains?: InputMaybe<Scalars['String']>
  readMoreText_exists?: InputMaybe<Scalars['Boolean']>
  readMoreText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  readMoreText_not?: InputMaybe<Scalars['String']>
  readMoreText_not_contains?: InputMaybe<Scalars['String']>
  readMoreText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LatestNewsSliceLinkingCollections = {
  __typename?: 'LatestNewsSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type LatestNewsSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LatestNewsSliceLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LatestNewsSliceLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LatestNewsSliceLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LatestNewsSliceLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum LatestNewsSliceOrder {
  ReadMoreTextAsc = 'readMoreText_ASC',
  ReadMoreTextDesc = 'readMoreText_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPage = Entry & {
  __typename?: 'LifeEventPage'
  category?: Maybe<ArticleCategory>
  content?: Maybe<LifeEventPageContent>
  contentfulMetadata: ContentfulMetadata
  image?: Maybe<Asset>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<LifeEventPageLinkingCollections>
  pageType?: Maybe<Scalars['String']>
  seeMoreText?: Maybe<Scalars['String']>
  shortIntro?: Maybe<Scalars['String']>
  shortTitle?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  thumbnail?: Maybe<Asset>
  tinyThumbnail?: Maybe<Asset>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPagePageTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageSeeMoreTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageShortIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageShortTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageTinyThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPage) */
export type LifeEventPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LifeEventPageCollection = {
  __typename?: 'LifeEventPageCollection'
  items: Array<Maybe<LifeEventPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LifeEventPageContent = {
  __typename?: 'LifeEventPageContent'
  json: Scalars['JSON']
  links: LifeEventPageContentLinks
}

export type LifeEventPageContentAssets = {
  __typename?: 'LifeEventPageContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type LifeEventPageContentEntries = {
  __typename?: 'LifeEventPageContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type LifeEventPageContentLinks = {
  __typename?: 'LifeEventPageContentLinks'
  assets: LifeEventPageContentAssets
  entries: LifeEventPageContentEntries
}

export type LifeEventPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<LifeEventPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LifeEventPageFilter>>>
  category?: InputMaybe<CfArticleCategoryNestedFilter>
  category_exists?: InputMaybe<Scalars['Boolean']>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  image_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageType?: InputMaybe<Scalars['String']>
  pageType_contains?: InputMaybe<Scalars['String']>
  pageType_exists?: InputMaybe<Scalars['Boolean']>
  pageType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageType_not?: InputMaybe<Scalars['String']>
  pageType_not_contains?: InputMaybe<Scalars['String']>
  pageType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  seeMoreText?: InputMaybe<Scalars['String']>
  seeMoreText_contains?: InputMaybe<Scalars['String']>
  seeMoreText_exists?: InputMaybe<Scalars['Boolean']>
  seeMoreText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  seeMoreText_not?: InputMaybe<Scalars['String']>
  seeMoreText_not_contains?: InputMaybe<Scalars['String']>
  seeMoreText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortIntro?: InputMaybe<Scalars['String']>
  shortIntro_contains?: InputMaybe<Scalars['String']>
  shortIntro_exists?: InputMaybe<Scalars['Boolean']>
  shortIntro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortIntro_not?: InputMaybe<Scalars['String']>
  shortIntro_not_contains?: InputMaybe<Scalars['String']>
  shortIntro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle?: InputMaybe<Scalars['String']>
  shortTitle_contains?: InputMaybe<Scalars['String']>
  shortTitle_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle_not?: InputMaybe<Scalars['String']>
  shortTitle_not_contains?: InputMaybe<Scalars['String']>
  shortTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>
  tinyThumbnail_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LifeEventPageLinkingCollections = {
  __typename?: 'LifeEventPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageCollection?: Maybe<FrontpageCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  lifeEventPageListSliceCollection?: Maybe<LifeEventPageListSliceCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  urlCollection?: Maybe<UrlCollection>
}

export type LifeEventPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageLinkingCollectionsFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageLinkingCollectionsLifeEventPageListSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPageListSlice) */
export type LifeEventPageListSlice = Entry & {
  __typename?: 'LifeEventPageListSlice'
  contentfulMetadata: ContentfulMetadata
  lifeEventPageListCollection?: Maybe<LifeEventPageListSliceLifeEventPageListCollection>
  linkedFrom?: Maybe<LifeEventPageListSliceLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPageListSlice) */
export type LifeEventPageListSliceLifeEventPageListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPageListSlice) */
export type LifeEventPageListSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/lifeEventPageListSlice) */
export type LifeEventPageListSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LifeEventPageListSliceCollection = {
  __typename?: 'LifeEventPageListSliceCollection'
  items: Array<Maybe<LifeEventPageListSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LifeEventPageListSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<LifeEventPageListSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LifeEventPageListSliceFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  lifeEventPageListCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LifeEventPageListSliceLifeEventPageListCollection = {
  __typename?: 'LifeEventPageListSliceLifeEventPageListCollection'
  items: Array<Maybe<LifeEventPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LifeEventPageListSliceLinkingCollections = {
  __typename?: 'LifeEventPageListSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
}

export type LifeEventPageListSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageListSliceLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LifeEventPageListSliceLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum LifeEventPageListSliceOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum LifeEventPageOrder {
  PageTypeAsc = 'pageType_ASC',
  PageTypeDesc = 'pageType_DESC',
  SeeMoreTextAsc = 'seeMoreText_ASC',
  SeeMoreTextDesc = 'seeMoreText_DESC',
  ShortIntroAsc = 'shortIntro_ASC',
  ShortIntroDesc = 'shortIntro_DESC',
  ShortTitleAsc = 'shortTitle_ASC',
  ShortTitleDesc = 'shortTitle_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type Link = Entry & {
  __typename?: 'Link'
  contentfulMetadata: ContentfulMetadata
  date?: Maybe<Scalars['DateTime']>
  intro?: Maybe<Scalars['String']>
  labels?: Maybe<Array<Maybe<Scalars['String']>>>
  linkReference?: Maybe<LinkLinkReference>
  linkedFrom?: Maybe<LinkLinkingCollections>
  searchable?: Maybe<Scalars['Boolean']>
  sys: Sys
  text?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkLabelsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkLinkReferenceArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkSearchableArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/link) */
export type LinkUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LinkCollection = {
  __typename?: 'LinkCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LinkFilter = {
  AND?: InputMaybe<Array<InputMaybe<LinkFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LinkFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  date?: InputMaybe<Scalars['DateTime']>
  date_exists?: InputMaybe<Scalars['Boolean']>
  date_gt?: InputMaybe<Scalars['DateTime']>
  date_gte?: InputMaybe<Scalars['DateTime']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  date_lt?: InputMaybe<Scalars['DateTime']>
  date_lte?: InputMaybe<Scalars['DateTime']>
  date_not?: InputMaybe<Scalars['DateTime']>
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_exists?: InputMaybe<Scalars['Boolean']>
  linkReference_exists?: InputMaybe<Scalars['Boolean']>
  searchable?: InputMaybe<Scalars['Boolean']>
  searchable_exists?: InputMaybe<Scalars['Boolean']>
  searchable_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  text?: InputMaybe<Scalars['String']>
  text_contains?: InputMaybe<Scalars['String']>
  text_exists?: InputMaybe<Scalars['Boolean']>
  text_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  text_not?: InputMaybe<Scalars['String']>
  text_not_contains?: InputMaybe<Scalars['String']>
  text_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkGroup) */
export type LinkGroup = Entry & {
  __typename?: 'LinkGroup'
  childrenLinksCollection?: Maybe<LinkGroupChildrenLinksCollection>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<LinkGroupLinkingCollections>
  name?: Maybe<Scalars['String']>
  primaryLink?: Maybe<Link>
  sys: Sys
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkGroup) */
export type LinkGroupChildrenLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkGroup) */
export type LinkGroupLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkGroup) */
export type LinkGroupNameArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkGroup) */
export type LinkGroupPrimaryLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type LinkGroupChildrenLinksCollection = {
  __typename?: 'LinkGroupChildrenLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LinkGroupCollection = {
  __typename?: 'LinkGroupCollection'
  items: Array<Maybe<LinkGroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LinkGroupFilter = {
  AND?: InputMaybe<Array<InputMaybe<LinkGroupFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LinkGroupFilter>>>
  childrenLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_exists?: InputMaybe<Scalars['Boolean']>
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  primaryLink?: InputMaybe<CfLinkNestedFilter>
  primaryLink_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type LinkGroupLinkingCollections = {
  __typename?: 'LinkGroupLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type LinkGroupLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkGroupLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkGroupLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum LinkGroupOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type LinkLinkReference = Article | ArticleCategory | LinkUrl | News

export type LinkLinkingCollections = {
  __typename?: 'LinkLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  contentTypeLocationCollection?: Maybe<ContentTypeLocationCollection>
  districtsCollection?: Maybe<DistrictsCollection>
  entryCollection?: Maybe<EntryCollection>
  eventSliceCollection?: Maybe<EventSliceCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  footerItemCollection?: Maybe<FooterItemCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  latestNewsSliceCollection?: Maybe<LatestNewsSliceCollection>
  linkGroupCollection?: Maybe<LinkGroupCollection>
  linkListCollection?: Maybe<LinkListCollection>
  menuCollection?: Maybe<MenuCollection>
  multipleStatisticsCollection?: Maybe<MultipleStatisticsCollection>
  oneColumnTextCollection?: Maybe<OneColumnTextCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  overviewLinksCollection?: Maybe<OverviewLinksCollection>
  pageHeaderCollection?: Maybe<PageHeaderCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  sidebarCardCollection?: Maybe<SidebarCardCollection>
  storyCollection?: Maybe<StoryCollection>
  supportQnaCollection?: Maybe<SupportQnaCollection>
  twoColumnTextCollection?: Maybe<TwoColumnTextCollection>
}

export type LinkLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsContentTypeLocationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsDistrictsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsEventSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsFooterItemCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsLatestNewsSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsLinkGroupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsLinkListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsMenuCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsMultipleStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsOneColumnTextCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsOverviewLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsPageHeaderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsSidebarCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsSupportQnaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkLinkingCollectionsTwoColumnTextCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkList) */
export type LinkList = Entry & {
  __typename?: 'LinkList'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<LinkListLinkingCollections>
  linksCollection?: Maybe<LinkListLinksCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkList) */
export type LinkListLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkList) */
export type LinkListLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkList) */
export type LinkListTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LinkListCollection = {
  __typename?: 'LinkListCollection'
  items: Array<Maybe<LinkList>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LinkListFilter = {
  AND?: InputMaybe<Array<InputMaybe<LinkListFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LinkListFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LinkListLinkingCollections = {
  __typename?: 'LinkListLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageCollection?: Maybe<FrontpageCollection>
}

export type LinkListLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkListLinkingCollectionsFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkListLinksCollection = {
  __typename?: 'LinkListLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum LinkListOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum LinkOrder {
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  SearchableAsc = 'searchable_ASC',
  SearchableDesc = 'searchable_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TextAsc = 'text_ASC',
  TextDesc = 'text_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkUrl) */
export type LinkUrl = Entry & {
  __typename?: 'LinkUrl'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<LinkUrlLinkingCollections>
  sys: Sys
  url?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkUrl) */
export type LinkUrlLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkUrl) */
export type LinkUrlUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LinkUrlCollection = {
  __typename?: 'LinkUrlCollection'
  items: Array<Maybe<LinkUrl>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LinkUrlFilter = {
  AND?: InputMaybe<Array<InputMaybe<LinkUrlFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LinkUrlFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LinkUrlLinkingCollections = {
  __typename?: 'LinkUrlLinkingCollections'
  alertBannerCollection?: Maybe<AlertBannerCollection>
  entryCollection?: Maybe<EntryCollection>
  featuredCollection?: Maybe<FeaturedCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  linkCollection?: Maybe<LinkCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
}

export type LinkUrlLinkingCollectionsAlertBannerCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkUrlLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkUrlLinkingCollectionsFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkUrlLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkUrlLinkingCollectionsLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkUrlLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkUrlLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum LinkUrlOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkedPage) */
export type LinkedPage = Entry & {
  __typename?: 'LinkedPage'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<LinkedPageLinkingCollections>
  page?: Maybe<LinkedPagePage>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkedPage) */
export type LinkedPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkedPage) */
export type LinkedPagePageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/linkedPage) */
export type LinkedPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LinkedPageCollection = {
  __typename?: 'LinkedPageCollection'
  items: Array<Maybe<LinkedPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LinkedPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<LinkedPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LinkedPageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  page_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LinkedPageLinkingCollections = {
  __typename?: 'LinkedPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  storyCollection?: Maybe<StoryCollection>
}

export type LinkedPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LinkedPageLinkingCollectionsStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum LinkedPageOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type LinkedPagePage = Article | ArticleCategory | News

/** A List of logos/images with a heading and short description [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/logoListSlice) */
export type LogoListSlice = Entry & {
  __typename?: 'LogoListSlice'
  body?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  imagesCollection?: Maybe<AssetCollection>
  linkedFrom?: Maybe<LogoListSliceLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** A List of logos/images with a heading and short description [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/logoListSlice) */
export type LogoListSliceBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A List of logos/images with a heading and short description [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/logoListSlice) */
export type LogoListSliceImagesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** A List of logos/images with a heading and short description [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/logoListSlice) */
export type LogoListSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A List of logos/images with a heading and short description [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/logoListSlice) */
export type LogoListSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type LogoListSliceCollection = {
  __typename?: 'LogoListSliceCollection'
  items: Array<Maybe<LogoListSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type LogoListSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<LogoListSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<LogoListSliceFilter>>>
  body?: InputMaybe<Scalars['String']>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  body_not?: InputMaybe<Scalars['String']>
  body_not_contains?: InputMaybe<Scalars['String']>
  body_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  imagesCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type LogoListSliceLinkingCollections = {
  __typename?: 'LogoListSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type LogoListSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LogoListSliceLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type LogoListSliceLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum LogoListSliceOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignup = Entry & {
  __typename?: 'MailingListSignup'
  buttonText?: Maybe<Scalars['String']>
  categories?: Maybe<Scalars['JSON']>
  categoryLabel?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  disclaimerLabel?: Maybe<Scalars['String']>
  fullNameLabel?: Maybe<Scalars['String']>
  image?: Maybe<Asset>
  inputLabel?: Maybe<Scalars['String']>
  inputs?: Maybe<Scalars['JSON']>
  linkedFrom?: Maybe<MailingListSignupLinkingCollections>
  noLabel?: Maybe<Scalars['String']>
  questionLabel?: Maybe<Scalars['String']>
  signupUrl?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
  variant?: Maybe<Scalars['String']>
  yesLabel?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupButtonTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupCategoriesArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupCategoryLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupDisclaimerLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupFullNameLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupInputLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupInputsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupNoLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupQuestionLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupSignupUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupVariantArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/mailingListSignup) */
export type MailingListSignupYesLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type MailingListSignupCollection = {
  __typename?: 'MailingListSignupCollection'
  items: Array<Maybe<MailingListSignup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MailingListSignupFilter = {
  AND?: InputMaybe<Array<InputMaybe<MailingListSignupFilter>>>
  OR?: InputMaybe<Array<InputMaybe<MailingListSignupFilter>>>
  buttonText?: InputMaybe<Scalars['String']>
  buttonText_contains?: InputMaybe<Scalars['String']>
  buttonText_exists?: InputMaybe<Scalars['Boolean']>
  buttonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  buttonText_not?: InputMaybe<Scalars['String']>
  buttonText_not_contains?: InputMaybe<Scalars['String']>
  buttonText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  categories_exists?: InputMaybe<Scalars['Boolean']>
  categoryLabel?: InputMaybe<Scalars['String']>
  categoryLabel_contains?: InputMaybe<Scalars['String']>
  categoryLabel_exists?: InputMaybe<Scalars['Boolean']>
  categoryLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  categoryLabel_not?: InputMaybe<Scalars['String']>
  categoryLabel_not_contains?: InputMaybe<Scalars['String']>
  categoryLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  disclaimerLabel?: InputMaybe<Scalars['String']>
  disclaimerLabel_contains?: InputMaybe<Scalars['String']>
  disclaimerLabel_exists?: InputMaybe<Scalars['Boolean']>
  disclaimerLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  disclaimerLabel_not?: InputMaybe<Scalars['String']>
  disclaimerLabel_not_contains?: InputMaybe<Scalars['String']>
  disclaimerLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fullNameLabel?: InputMaybe<Scalars['String']>
  fullNameLabel_contains?: InputMaybe<Scalars['String']>
  fullNameLabel_exists?: InputMaybe<Scalars['Boolean']>
  fullNameLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fullNameLabel_not?: InputMaybe<Scalars['String']>
  fullNameLabel_not_contains?: InputMaybe<Scalars['String']>
  fullNameLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  image_exists?: InputMaybe<Scalars['Boolean']>
  inputLabel?: InputMaybe<Scalars['String']>
  inputLabel_contains?: InputMaybe<Scalars['String']>
  inputLabel_exists?: InputMaybe<Scalars['Boolean']>
  inputLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  inputLabel_not?: InputMaybe<Scalars['String']>
  inputLabel_not_contains?: InputMaybe<Scalars['String']>
  inputLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  inputs_exists?: InputMaybe<Scalars['Boolean']>
  noLabel?: InputMaybe<Scalars['String']>
  noLabel_contains?: InputMaybe<Scalars['String']>
  noLabel_exists?: InputMaybe<Scalars['Boolean']>
  noLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  noLabel_not?: InputMaybe<Scalars['String']>
  noLabel_not_contains?: InputMaybe<Scalars['String']>
  noLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  questionLabel?: InputMaybe<Scalars['String']>
  questionLabel_contains?: InputMaybe<Scalars['String']>
  questionLabel_exists?: InputMaybe<Scalars['Boolean']>
  questionLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  questionLabel_not?: InputMaybe<Scalars['String']>
  questionLabel_not_contains?: InputMaybe<Scalars['String']>
  questionLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  signupUrl?: InputMaybe<Scalars['String']>
  signupUrl_contains?: InputMaybe<Scalars['String']>
  signupUrl_exists?: InputMaybe<Scalars['Boolean']>
  signupUrl_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  signupUrl_not?: InputMaybe<Scalars['String']>
  signupUrl_not_contains?: InputMaybe<Scalars['String']>
  signupUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  variant?: InputMaybe<Scalars['String']>
  variant_contains?: InputMaybe<Scalars['String']>
  variant_exists?: InputMaybe<Scalars['Boolean']>
  variant_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  variant_not?: InputMaybe<Scalars['String']>
  variant_not_contains?: InputMaybe<Scalars['String']>
  variant_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  yesLabel?: InputMaybe<Scalars['String']>
  yesLabel_contains?: InputMaybe<Scalars['String']>
  yesLabel_exists?: InputMaybe<Scalars['Boolean']>
  yesLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  yesLabel_not?: InputMaybe<Scalars['String']>
  yesLabel_not_contains?: InputMaybe<Scalars['String']>
  yesLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type MailingListSignupLinkingCollections = {
  __typename?: 'MailingListSignupLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type MailingListSignupLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum MailingListSignupOrder {
  ButtonTextAsc = 'buttonText_ASC',
  ButtonTextDesc = 'buttonText_DESC',
  CategoryLabelAsc = 'categoryLabel_ASC',
  CategoryLabelDesc = 'categoryLabel_DESC',
  DisclaimerLabelAsc = 'disclaimerLabel_ASC',
  DisclaimerLabelDesc = 'disclaimerLabel_DESC',
  FullNameLabelAsc = 'fullNameLabel_ASC',
  FullNameLabelDesc = 'fullNameLabel_DESC',
  InputLabelAsc = 'inputLabel_ASC',
  InputLabelDesc = 'inputLabel_DESC',
  NoLabelAsc = 'noLabel_ASC',
  NoLabelDesc = 'noLabel_DESC',
  QuestionLabelAsc = 'questionLabel_ASC',
  QuestionLabelDesc = 'questionLabel_DESC',
  SignupUrlAsc = 'signupUrl_ASC',
  SignupUrlDesc = 'signupUrl_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VariantAsc = 'variant_ASC',
  VariantDesc = 'variant_DESC',
  YesLabelAsc = 'yesLabel_ASC',
  YesLabelDesc = 'yesLabel_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menu) */
export type Menu = Entry & {
  __typename?: 'Menu'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<MenuLinkingCollections>
  linksCollection?: Maybe<MenuLinksCollection>
  menuLinksCollection?: Maybe<MenuMenuLinksCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menu) */
export type MenuLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menu) */
export type MenuLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menu) */
export type MenuMenuLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menu) */
export type MenuTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type MenuCollection = {
  __typename?: 'MenuCollection'
  items: Array<Maybe<Menu>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MenuFilter = {
  AND?: InputMaybe<Array<InputMaybe<MenuFilter>>>
  OR?: InputMaybe<Array<InputMaybe<MenuFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  menuLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Simple link for menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLink) */
export type MenuLink = Entry & {
  __typename?: 'MenuLink'
  contentfulMetadata: ContentfulMetadata
  link?: Maybe<MenuLinkLink>
  linkedFrom?: Maybe<MenuLinkLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Simple link for menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLink) */
export type MenuLinkLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Simple link for menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLink) */
export type MenuLinkLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Simple link for menu [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLink) */
export type MenuLinkTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type MenuLinkCollection = {
  __typename?: 'MenuLinkCollection'
  items: Array<Maybe<MenuLink>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MenuLinkFilter = {
  AND?: InputMaybe<Array<InputMaybe<MenuLinkFilter>>>
  OR?: InputMaybe<Array<InputMaybe<MenuLinkFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type MenuLinkLink =
  | Article
  | ArticleCategory
  | LifeEventPage
  | LinkUrl
  | News
  | OrganizationPage
  | OrganizationSubpage
  | SubArticle
  | VidspyrnaFrontpage
  | VidspyrnaPage

export type MenuLinkLinkingCollections = {
  __typename?: 'MenuLinkLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
}

export type MenuLinkLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinkLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinkLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum MenuLinkOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** Menu link that can have child links for hierarchical menu structures [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLinkWithChildren) */
export type MenuLinkWithChildren = Entry & {
  __typename?: 'MenuLinkWithChildren'
  childLinksCollection?: Maybe<MenuLinkWithChildrenChildLinksCollection>
  contentfulMetadata: ContentfulMetadata
  link?: Maybe<MenuLinkWithChildrenLink>
  linkedFrom?: Maybe<MenuLinkWithChildrenLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Menu link that can have child links for hierarchical menu structures [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLinkWithChildren) */
export type MenuLinkWithChildrenChildLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Menu link that can have child links for hierarchical menu structures [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLinkWithChildren) */
export type MenuLinkWithChildrenLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Menu link that can have child links for hierarchical menu structures [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLinkWithChildren) */
export type MenuLinkWithChildrenLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Menu link that can have child links for hierarchical menu structures [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/menuLinkWithChildren) */
export type MenuLinkWithChildrenTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type MenuLinkWithChildrenChildLinksCollection = {
  __typename?: 'MenuLinkWithChildrenChildLinksCollection'
  items: Array<Maybe<MenuLink>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MenuLinkWithChildrenCollection = {
  __typename?: 'MenuLinkWithChildrenCollection'
  items: Array<Maybe<MenuLinkWithChildren>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MenuLinkWithChildrenFilter = {
  AND?: InputMaybe<Array<InputMaybe<MenuLinkWithChildrenFilter>>>
  OR?: InputMaybe<Array<InputMaybe<MenuLinkWithChildrenFilter>>>
  childLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type MenuLinkWithChildrenLink =
  | Article
  | ArticleCategory
  | LifeEventPage
  | LinkUrl
  | News
  | OrganizationPage
  | OrganizationSubpage
  | SubArticle
  | VidspyrnaFrontpage
  | VidspyrnaPage

export type MenuLinkWithChildrenLinkingCollections = {
  __typename?: 'MenuLinkWithChildrenLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  menuCollection?: Maybe<MenuCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
}

export type MenuLinkWithChildrenLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinkWithChildrenLinkingCollectionsMenuCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinkWithChildrenLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum MenuLinkWithChildrenOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type MenuLinkingCollections = {
  __typename?: 'MenuLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  genericOverviewPageCollection?: Maybe<GenericOverviewPageCollection>
  groupedMenuCollection?: Maybe<GroupedMenuCollection>
}

export type MenuLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinkingCollectionsGenericOverviewPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinkingCollectionsGroupedMenuCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MenuLinksCollection = {
  __typename?: 'MenuLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MenuMenuLinksCollection = {
  __typename?: 'MenuMenuLinksCollection'
  items: Array<Maybe<MenuLinkWithChildren>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum MenuOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/multipleStatistics) */
export type MultipleStatistics = Entry & {
  __typename?: 'MultipleStatistics'
  contentfulMetadata: ContentfulMetadata
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  link?: Maybe<Link>
  linkedFrom?: Maybe<MultipleStatisticsLinkingCollections>
  statisticsCollection?: Maybe<MultipleStatisticsStatisticsCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/multipleStatistics) */
export type MultipleStatisticsHasBorderAboveArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/multipleStatistics) */
export type MultipleStatisticsLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/multipleStatistics) */
export type MultipleStatisticsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/multipleStatistics) */
export type MultipleStatisticsStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/multipleStatistics) */
export type MultipleStatisticsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type MultipleStatisticsCollection = {
  __typename?: 'MultipleStatisticsCollection'
  items: Array<Maybe<MultipleStatistics>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type MultipleStatisticsFilter = {
  AND?: InputMaybe<Array<InputMaybe<MultipleStatisticsFilter>>>
  OR?: InputMaybe<Array<InputMaybe<MultipleStatisticsFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  hasBorderAbove?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_not?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  statisticsCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type MultipleStatisticsLinkingCollections = {
  __typename?: 'MultipleStatisticsLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type MultipleStatisticsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MultipleStatisticsLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MultipleStatisticsLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MultipleStatisticsLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type MultipleStatisticsLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum MultipleStatisticsOrder {
  HasBorderAboveAsc = 'hasBorderAbove_ASC',
  HasBorderAboveDesc = 'hasBorderAbove_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type MultipleStatisticsStatisticsCollection = {
  __typename?: 'MultipleStatisticsStatisticsCollection'
  items: Array<Maybe<Statistics>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Namespace containing translations [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/namespace) */
export type Namespace = Entry & {
  __typename?: 'Namespace'
  contentfulMetadata: ContentfulMetadata
  defaults?: Maybe<Scalars['JSON']>
  fallback?: Maybe<Scalars['JSON']>
  linkedFrom?: Maybe<NamespaceLinkingCollections>
  namespace?: Maybe<Scalars['String']>
  strings?: Maybe<Scalars['JSON']>
  sys: Sys
}

/** Namespace containing translations [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/namespace) */
export type NamespaceDefaultsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Namespace containing translations [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/namespace) */
export type NamespaceFallbackArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Namespace containing translations [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/namespace) */
export type NamespaceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Namespace containing translations [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/namespace) */
export type NamespaceNamespaceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Namespace containing translations [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/namespace) */
export type NamespaceStringsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type NamespaceCollection = {
  __typename?: 'NamespaceCollection'
  items: Array<Maybe<Namespace>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type NamespaceFilter = {
  AND?: InputMaybe<Array<InputMaybe<NamespaceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<NamespaceFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  defaults_exists?: InputMaybe<Scalars['Boolean']>
  fallback_exists?: InputMaybe<Scalars['Boolean']>
  namespace?: InputMaybe<Scalars['String']>
  namespace_contains?: InputMaybe<Scalars['String']>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  namespace_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  namespace_not?: InputMaybe<Scalars['String']>
  namespace_not_contains?: InputMaybe<Scalars['String']>
  namespace_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  strings_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type NamespaceLinkingCollections = {
  __typename?: 'NamespaceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type NamespaceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum NamespaceOrder {
  NamespaceAsc = 'namespace_ASC',
  NamespaceDesc = 'namespace_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type News = Entry & {
  __typename?: 'News'
  author?: Maybe<Entry>
  content?: Maybe<NewsContent>
  contentStatus?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  date?: Maybe<Scalars['DateTime']>
  fullWidthImageInContent?: Maybe<Scalars['Boolean']>
  genericTagsCollection?: Maybe<NewsGenericTagsCollection>
  image?: Maybe<Asset>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<NewsLinkingCollections>
  readMoreText?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  subtitle?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsAuthorArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsContentStatusArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsFullWidthImageInContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsGenericTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsReadMoreTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsSubtitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/news) */
export type NewsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type NewsCollection = {
  __typename?: 'NewsCollection'
  items: Array<Maybe<News>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type NewsContent = {
  __typename?: 'NewsContent'
  json: Scalars['JSON']
  links: NewsContentLinks
}

export type NewsContentAssets = {
  __typename?: 'NewsContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type NewsContentEntries = {
  __typename?: 'NewsContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type NewsContentLinks = {
  __typename?: 'NewsContentLinks'
  assets: NewsContentAssets
  entries: NewsContentEntries
}

export type NewsFilter = {
  AND?: InputMaybe<Array<InputMaybe<NewsFilter>>>
  OR?: InputMaybe<Array<InputMaybe<NewsFilter>>>
  author_exists?: InputMaybe<Scalars['Boolean']>
  contentStatus?: InputMaybe<Scalars['String']>
  contentStatus_contains?: InputMaybe<Scalars['String']>
  contentStatus_exists?: InputMaybe<Scalars['Boolean']>
  contentStatus_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentStatus_not?: InputMaybe<Scalars['String']>
  contentStatus_not_contains?: InputMaybe<Scalars['String']>
  contentStatus_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  date?: InputMaybe<Scalars['DateTime']>
  date_exists?: InputMaybe<Scalars['Boolean']>
  date_gt?: InputMaybe<Scalars['DateTime']>
  date_gte?: InputMaybe<Scalars['DateTime']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  date_lt?: InputMaybe<Scalars['DateTime']>
  date_lte?: InputMaybe<Scalars['DateTime']>
  date_not?: InputMaybe<Scalars['DateTime']>
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  fullWidthImageInContent?: InputMaybe<Scalars['Boolean']>
  fullWidthImageInContent_exists?: InputMaybe<Scalars['Boolean']>
  fullWidthImageInContent_not?: InputMaybe<Scalars['Boolean']>
  genericTagsCollection_exists?: InputMaybe<Scalars['Boolean']>
  image_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  readMoreText?: InputMaybe<Scalars['String']>
  readMoreText_contains?: InputMaybe<Scalars['String']>
  readMoreText_exists?: InputMaybe<Scalars['Boolean']>
  readMoreText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  readMoreText_not?: InputMaybe<Scalars['String']>
  readMoreText_not_contains?: InputMaybe<Scalars['String']>
  readMoreText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle?: InputMaybe<Scalars['String']>
  subtitle_contains?: InputMaybe<Scalars['String']>
  subtitle_exists?: InputMaybe<Scalars['Boolean']>
  subtitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle_not?: InputMaybe<Scalars['String']>
  subtitle_not_contains?: InputMaybe<Scalars['String']>
  subtitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type NewsGenericTagsCollection = {
  __typename?: 'NewsGenericTagsCollection'
  items: Array<Maybe<GenericTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type NewsLinkingCollections = {
  __typename?: 'NewsLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  linkCollection?: Maybe<LinkCollection>
  linkedPageCollection?: Maybe<LinkedPageCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  storyCollection?: Maybe<StoryCollection>
  urlCollection?: Maybe<UrlCollection>
  vidspyrnaFeaturedNewsCollection?: Maybe<VidspyrnaFeaturedNewsCollection>
}

export type NewsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsLinkedPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NewsLinkingCollectionsVidspyrnaFeaturedNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum NewsOrder {
  ContentStatusAsc = 'contentStatus_ASC',
  ContentStatusDesc = 'contentStatus_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  FullWidthImageInContentAsc = 'fullWidthImageInContent_ASC',
  FullWidthImageInContentDesc = 'fullWidthImageInContent_DESC',
  ReadMoreTextAsc = 'readMoreText_ASC',
  ReadMoreTextDesc = 'readMoreText_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBullet) */
export type NumberBullet = Entry & {
  __typename?: 'NumberBullet'
  body?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<NumberBulletLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBullet) */
export type NumberBulletBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBullet) */
export type NumberBulletLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBullet) */
export type NumberBulletTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type NumberBulletCollection = {
  __typename?: 'NumberBulletCollection'
  items: Array<Maybe<NumberBullet>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type NumberBulletFilter = {
  AND?: InputMaybe<Array<InputMaybe<NumberBulletFilter>>>
  OR?: InputMaybe<Array<InputMaybe<NumberBulletFilter>>>
  body?: InputMaybe<Scalars['String']>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  body_not?: InputMaybe<Scalars['String']>
  body_not_contains?: InputMaybe<Scalars['String']>
  body_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type NumberBulletLinkingCollections = {
  __typename?: 'NumberBulletLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  numberBulletSectionCollection?: Maybe<NumberBulletSectionCollection>
}

export type NumberBulletLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NumberBulletLinkingCollectionsNumberBulletSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum NumberBulletOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBulletSection) */
export type NumberBulletSection = Entry & {
  __typename?: 'NumberBulletSection'
  bulletsCollection?: Maybe<NumberBulletSectionBulletsCollection>
  contentfulMetadata: ContentfulMetadata
  defaultVisible?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<NumberBulletSectionLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBulletSection) */
export type NumberBulletSectionBulletsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBulletSection) */
export type NumberBulletSectionDefaultVisibleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBulletSection) */
export type NumberBulletSectionLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/numberBulletSection) */
export type NumberBulletSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type NumberBulletSectionBulletsCollection = {
  __typename?: 'NumberBulletSectionBulletsCollection'
  items: Array<Maybe<NumberBullet>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type NumberBulletSectionCollection = {
  __typename?: 'NumberBulletSectionCollection'
  items: Array<Maybe<NumberBulletSection>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type NumberBulletSectionFilter = {
  AND?: InputMaybe<Array<InputMaybe<NumberBulletSectionFilter>>>
  OR?: InputMaybe<Array<InputMaybe<NumberBulletSectionFilter>>>
  bulletsCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  defaultVisible?: InputMaybe<Scalars['Int']>
  defaultVisible_exists?: InputMaybe<Scalars['Boolean']>
  defaultVisible_gt?: InputMaybe<Scalars['Int']>
  defaultVisible_gte?: InputMaybe<Scalars['Int']>
  defaultVisible_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  defaultVisible_lt?: InputMaybe<Scalars['Int']>
  defaultVisible_lte?: InputMaybe<Scalars['Int']>
  defaultVisible_not?: InputMaybe<Scalars['Int']>
  defaultVisible_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type NumberBulletSectionLinkingCollections = {
  __typename?: 'NumberBulletSectionLinkingCollections'
  bigBulletListCollection?: Maybe<BigBulletListCollection>
  entryCollection?: Maybe<EntryCollection>
}

export type NumberBulletSectionLinkingCollectionsBigBulletListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type NumberBulletSectionLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum NumberBulletSectionOrder {
  DefaultVisibleAsc = 'defaultVisible_ASC',
  DefaultVisibleDesc = 'defaultVisible_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnText = Entry & {
  __typename?: 'OneColumnText'
  content?: Maybe<OneColumnTextContent>
  contentfulMetadata: ContentfulMetadata
  dividerOnTop?: Maybe<Scalars['Boolean']>
  link?: Maybe<Link>
  linkedFrom?: Maybe<OneColumnTextLinkingCollections>
  showTitle?: Maybe<Scalars['Boolean']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnTextContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnTextDividerOnTopArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnTextLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnTextLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnTextShowTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/oneColumnText) */
export type OneColumnTextTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type OneColumnTextCollection = {
  __typename?: 'OneColumnTextCollection'
  items: Array<Maybe<OneColumnText>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OneColumnTextContent = {
  __typename?: 'OneColumnTextContent'
  json: Scalars['JSON']
  links: OneColumnTextContentLinks
}

export type OneColumnTextContentAssets = {
  __typename?: 'OneColumnTextContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type OneColumnTextContentEntries = {
  __typename?: 'OneColumnTextContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type OneColumnTextContentLinks = {
  __typename?: 'OneColumnTextContentLinks'
  assets: OneColumnTextContentAssets
  entries: OneColumnTextContentEntries
}

export type OneColumnTextFilter = {
  AND?: InputMaybe<Array<InputMaybe<OneColumnTextFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OneColumnTextFilter>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  dividerOnTop?: InputMaybe<Scalars['Boolean']>
  dividerOnTop_exists?: InputMaybe<Scalars['Boolean']>
  dividerOnTop_not?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  showTitle?: InputMaybe<Scalars['Boolean']>
  showTitle_exists?: InputMaybe<Scalars['Boolean']>
  showTitle_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type OneColumnTextLinkingCollections = {
  __typename?: 'OneColumnTextLinkingCollections'
  accordionSliceCollection?: Maybe<AccordionSliceCollection>
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type OneColumnTextLinkingCollectionsAccordionSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OneColumnTextLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OneColumnTextLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OneColumnTextLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OneColumnTextLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OneColumnTextLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum OneColumnTextOrder {
  DividerOnTopAsc = 'dividerOnTop_ASC',
  DividerOnTopDesc = 'dividerOnTop_DESC',
  ShowTitleAsc = 'showTitle_ASC',
  ShowTitleDesc = 'showTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPage = Entry & {
  __typename?: 'OpenDataPage'
  chartSectionTitle?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  externalLinkCardSelection?: Maybe<CardSection>
  externalLinkSectionDescription?: Maybe<Scalars['String']>
  externalLinkSectionImage?: Maybe<Asset>
  externalLinkSectionTitle?: Maybe<Scalars['String']>
  graphCardsCollection?: Maybe<OpenDataPageGraphCardsCollection>
  link?: Maybe<Scalars['String']>
  linkTitle?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<OpenDataPageLinkingCollections>
  pageDescription?: Maybe<Scalars['String']>
  pageHeaderGraph?: Maybe<GraphCard>
  pageTitle?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  statisticsCardsSectionCollection?: Maybe<OpenDataPageStatisticsCardsSectionCollection>
  sys: Sys
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageChartSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageExternalLinkCardSelectionArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageExternalLinkSectionDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageExternalLinkSectionImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageExternalLinkSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageGraphCardsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageLinkTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPagePageDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPagePageHeaderGraphArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPagePageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Landing page for Open Data Page, where public data is made available. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataPage) */
export type OpenDataPageStatisticsCardsSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OpenDataPageCollection = {
  __typename?: 'OpenDataPageCollection'
  items: Array<Maybe<OpenDataPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OpenDataPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<OpenDataPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OpenDataPageFilter>>>
  chartSectionTitle?: InputMaybe<Scalars['String']>
  chartSectionTitle_contains?: InputMaybe<Scalars['String']>
  chartSectionTitle_exists?: InputMaybe<Scalars['Boolean']>
  chartSectionTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  chartSectionTitle_not?: InputMaybe<Scalars['String']>
  chartSectionTitle_not_contains?: InputMaybe<Scalars['String']>
  chartSectionTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  externalLinkCardSelection?: InputMaybe<CfCardSectionNestedFilter>
  externalLinkCardSelection_exists?: InputMaybe<Scalars['Boolean']>
  externalLinkSectionDescription?: InputMaybe<Scalars['String']>
  externalLinkSectionDescription_contains?: InputMaybe<Scalars['String']>
  externalLinkSectionDescription_exists?: InputMaybe<Scalars['Boolean']>
  externalLinkSectionDescription_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  externalLinkSectionDescription_not?: InputMaybe<Scalars['String']>
  externalLinkSectionDescription_not_contains?: InputMaybe<Scalars['String']>
  externalLinkSectionDescription_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  externalLinkSectionImage_exists?: InputMaybe<Scalars['Boolean']>
  externalLinkSectionTitle?: InputMaybe<Scalars['String']>
  externalLinkSectionTitle_contains?: InputMaybe<Scalars['String']>
  externalLinkSectionTitle_exists?: InputMaybe<Scalars['Boolean']>
  externalLinkSectionTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  externalLinkSectionTitle_not?: InputMaybe<Scalars['String']>
  externalLinkSectionTitle_not_contains?: InputMaybe<Scalars['String']>
  externalLinkSectionTitle_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  graphCardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<Scalars['String']>
  linkTitle?: InputMaybe<Scalars['String']>
  linkTitle_contains?: InputMaybe<Scalars['String']>
  linkTitle_exists?: InputMaybe<Scalars['Boolean']>
  linkTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkTitle_not?: InputMaybe<Scalars['String']>
  linkTitle_not_contains?: InputMaybe<Scalars['String']>
  linkTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageDescription?: InputMaybe<Scalars['String']>
  pageDescription_contains?: InputMaybe<Scalars['String']>
  pageDescription_exists?: InputMaybe<Scalars['Boolean']>
  pageDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageDescription_not?: InputMaybe<Scalars['String']>
  pageDescription_not_contains?: InputMaybe<Scalars['String']>
  pageDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageHeaderGraph?: InputMaybe<CfGraphCardNestedFilter>
  pageHeaderGraph_exists?: InputMaybe<Scalars['Boolean']>
  pageTitle?: InputMaybe<Scalars['String']>
  pageTitle_contains?: InputMaybe<Scalars['String']>
  pageTitle_exists?: InputMaybe<Scalars['Boolean']>
  pageTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageTitle_not?: InputMaybe<Scalars['String']>
  pageTitle_not_contains?: InputMaybe<Scalars['String']>
  pageTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  statisticsCardsSectionCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type OpenDataPageGraphCardsCollection = {
  __typename?: 'OpenDataPageGraphCardsCollection'
  items: Array<Maybe<GraphCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OpenDataPageLinkingCollections = {
  __typename?: 'OpenDataPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type OpenDataPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum OpenDataPageOrder {
  ChartSectionTitleAsc = 'chartSectionTitle_ASC',
  ChartSectionTitleDesc = 'chartSectionTitle_DESC',
  ExternalLinkSectionTitleAsc = 'externalLinkSectionTitle_ASC',
  ExternalLinkSectionTitleDesc = 'externalLinkSectionTitle_DESC',
  LinkTitleAsc = 'linkTitle_ASC',
  LinkTitleDesc = 'linkTitle_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PageTitleAsc = 'pageTitle_ASC',
  PageTitleDesc = 'pageTitle_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type OpenDataPageStatisticsCardsSectionCollection = {
  __typename?: 'OpenDataPageStatisticsCardsSectionCollection'
  items: Array<Maybe<StatisticsCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpage = Entry & {
  __typename?: 'OpenDataSubpage'
  contentfulMetadata: ContentfulMetadata
  fundDescription?: Maybe<Scalars['String']>
  fundTitle?: Maybe<Scalars['String']>
  graphCardsCollection?: Maybe<OpenDataSubpageGraphCardsCollection>
  linkedFrom?: Maybe<OpenDataSubpageLinkingCollections>
  organizationLogo?: Maybe<Asset>
  pageTitle?: Maybe<Scalars['String']>
  statisticsCardsCollection?: Maybe<OpenDataSubpageStatisticsCardsCollection>
  sys: Sys
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpageFundDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpageFundTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpageGraphCardsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpageOrganizationLogoArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpagePageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Organization dashboard [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/openDataSubpage) */
export type OpenDataSubpageStatisticsCardsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OpenDataSubpageCollection = {
  __typename?: 'OpenDataSubpageCollection'
  items: Array<Maybe<OpenDataSubpage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OpenDataSubpageFilter = {
  AND?: InputMaybe<Array<InputMaybe<OpenDataSubpageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OpenDataSubpageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  fundDescription?: InputMaybe<Scalars['String']>
  fundDescription_contains?: InputMaybe<Scalars['String']>
  fundDescription_exists?: InputMaybe<Scalars['Boolean']>
  fundDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fundDescription_not?: InputMaybe<Scalars['String']>
  fundDescription_not_contains?: InputMaybe<Scalars['String']>
  fundDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fundTitle?: InputMaybe<Scalars['String']>
  fundTitle_contains?: InputMaybe<Scalars['String']>
  fundTitle_exists?: InputMaybe<Scalars['Boolean']>
  fundTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  fundTitle_not?: InputMaybe<Scalars['String']>
  fundTitle_not_contains?: InputMaybe<Scalars['String']>
  fundTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphCardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  organizationLogo_exists?: InputMaybe<Scalars['Boolean']>
  pageTitle?: InputMaybe<Scalars['String']>
  pageTitle_contains?: InputMaybe<Scalars['String']>
  pageTitle_exists?: InputMaybe<Scalars['Boolean']>
  pageTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  pageTitle_not?: InputMaybe<Scalars['String']>
  pageTitle_not_contains?: InputMaybe<Scalars['String']>
  pageTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  statisticsCardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type OpenDataSubpageGraphCardsCollection = {
  __typename?: 'OpenDataSubpageGraphCardsCollection'
  items: Array<Maybe<GraphCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OpenDataSubpageLinkingCollections = {
  __typename?: 'OpenDataSubpageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type OpenDataSubpageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum OpenDataSubpageOrder {
  FundDescriptionAsc = 'fundDescription_ASC',
  FundDescriptionDesc = 'fundDescription_DESC',
  FundTitleAsc = 'fundTitle_ASC',
  FundTitleDesc = 'fundTitle_DESC',
  PageTitleAsc = 'pageTitle_ASC',
  PageTitleDesc = 'pageTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type OpenDataSubpageStatisticsCardsCollection = {
  __typename?: 'OpenDataSubpageStatisticsCardsCollection'
  items: Array<Maybe<StatisticsCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type Organization = Entry & {
  __typename?: 'Organization'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  footerItemsCollection?: Maybe<OrganizationFooterItemsCollection>
  hasALandingPage?: Maybe<Scalars['Boolean']>
  link?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<OrganizationLinkingCollections>
  logo?: Maybe<Asset>
  namespace?: Maybe<UiConfiguration>
  phone?: Maybe<Scalars['String']>
  publishedMaterialSearchFilterGenericTagsCollection?: Maybe<OrganizationPublishedMaterialSearchFilterGenericTagsCollection>
  serviceWebEnabled?: Maybe<Scalars['Boolean']>
  serviceWebFeaturedImage?: Maybe<Asset>
  serviceWebPopularQuestionCount?: Maybe<Scalars['Int']>
  serviceWebTitle?: Maybe<Scalars['String']>
  shortTitle?: Maybe<Scalars['String']>
  showsUpOnTheOrganizationsPage?: Maybe<Scalars['Boolean']>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  tagCollection?: Maybe<OrganizationTagCollection>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationEmailArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationFooterItemsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationHasALandingPageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationLogoArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationNamespaceArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationPhoneArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationPublishedMaterialSearchFilterGenericTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationServiceWebEnabledArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationServiceWebFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationServiceWebPopularQuestionCountArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationServiceWebTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationShortTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationShowsUpOnTheOrganizationsPageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationTagCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organization) */
export type OrganizationTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type OrganizationCollection = {
  __typename?: 'OrganizationCollection'
  items: Array<Maybe<Organization>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationFilter = {
  AND?: InputMaybe<Array<InputMaybe<OrganizationFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OrganizationFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  email?: InputMaybe<Scalars['String']>
  email_contains?: InputMaybe<Scalars['String']>
  email_exists?: InputMaybe<Scalars['Boolean']>
  email_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  email_not?: InputMaybe<Scalars['String']>
  email_not_contains?: InputMaybe<Scalars['String']>
  email_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  footerItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  hasALandingPage?: InputMaybe<Scalars['Boolean']>
  hasALandingPage_exists?: InputMaybe<Scalars['Boolean']>
  hasALandingPage_not?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<Scalars['String']>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  logo_exists?: InputMaybe<Scalars['Boolean']>
  namespace?: InputMaybe<CfUiConfigurationNestedFilter>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  phone?: InputMaybe<Scalars['String']>
  phone_contains?: InputMaybe<Scalars['String']>
  phone_exists?: InputMaybe<Scalars['Boolean']>
  phone_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  phone_not?: InputMaybe<Scalars['String']>
  phone_not_contains?: InputMaybe<Scalars['String']>
  phone_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publishedMaterialSearchFilterGenericTagsCollection_exists?: InputMaybe<
    Scalars['Boolean']
  >
  serviceWebEnabled?: InputMaybe<Scalars['Boolean']>
  serviceWebEnabled_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebEnabled_not?: InputMaybe<Scalars['Boolean']>
  serviceWebFeaturedImage_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebPopularQuestionCount?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebPopularQuestionCount_gt?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_gte?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_in?: InputMaybe<
    Array<InputMaybe<Scalars['Int']>>
  >
  serviceWebPopularQuestionCount_lt?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_lte?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_not?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['Int']>>
  >
  serviceWebTitle?: InputMaybe<Scalars['String']>
  serviceWebTitle_contains?: InputMaybe<Scalars['String']>
  serviceWebTitle_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  serviceWebTitle_not?: InputMaybe<Scalars['String']>
  serviceWebTitle_not_contains?: InputMaybe<Scalars['String']>
  serviceWebTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle?: InputMaybe<Scalars['String']>
  shortTitle_contains?: InputMaybe<Scalars['String']>
  shortTitle_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle_not?: InputMaybe<Scalars['String']>
  shortTitle_not_contains?: InputMaybe<Scalars['String']>
  shortTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  showsUpOnTheOrganizationsPage?: InputMaybe<Scalars['Boolean']>
  showsUpOnTheOrganizationsPage_exists?: InputMaybe<Scalars['Boolean']>
  showsUpOnTheOrganizationsPage_not?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  tagCollection_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type OrganizationFooterItemsCollection = {
  __typename?: 'OrganizationFooterItemsCollection'
  items: Array<Maybe<FooterItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationLinkingCollections = {
  __typename?: 'OrganizationLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  auctionCollection?: Maybe<AuctionCollection>
  enhancedAssetCollection?: Maybe<EnhancedAssetCollection>
  entryCollection?: Maybe<EntryCollection>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  hnippTemplateCollection?: Maybe<HnippTemplateCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  supportCategoryCollection?: Maybe<SupportCategoryCollection>
  supportQnaCollection?: Maybe<SupportQnaCollection>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
}

export type OrganizationLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsAuctionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsEnhancedAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsHnippTemplateCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsSupportCategoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsSupportQnaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationLinkingCollectionsVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum OrganizationOrder {
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  HasALandingPageAsc = 'hasALandingPage_ASC',
  HasALandingPageDesc = 'hasALandingPage_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PhoneAsc = 'phone_ASC',
  PhoneDesc = 'phone_DESC',
  ServiceWebEnabledAsc = 'serviceWebEnabled_ASC',
  ServiceWebEnabledDesc = 'serviceWebEnabled_DESC',
  ServiceWebPopularQuestionCountAsc = 'serviceWebPopularQuestionCount_ASC',
  ServiceWebPopularQuestionCountDesc = 'serviceWebPopularQuestionCount_DESC',
  ServiceWebTitleAsc = 'serviceWebTitle_ASC',
  ServiceWebTitleDesc = 'serviceWebTitle_DESC',
  ShortTitleAsc = 'shortTitle_ASC',
  ShortTitleDesc = 'shortTitle_DESC',
  ShowsUpOnTheOrganizationsPageAsc = 'showsUpOnTheOrganizationsPage_ASC',
  ShowsUpOnTheOrganizationsPageDesc = 'showsUpOnTheOrganizationsPage_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPage = Entry & {
  __typename?: 'OrganizationPage'
  alertBanner?: Maybe<AlertBanner>
  bottomSlicesCollection?: Maybe<OrganizationPageBottomSlicesCollection>
  contentfulMetadata: ContentfulMetadata
  defaultHeaderImage?: Maybe<Asset>
  description?: Maybe<Scalars['String']>
  externalLinksCollection?: Maybe<OrganizationPageExternalLinksCollection>
  featuredImage?: Maybe<Asset>
  footerItemsCollection?: Maybe<OrganizationPageFooterItemsCollection>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<OrganizationPageLinkingCollections>
  menuItemsCollection?: Maybe<OrganizationPageMenuItemsCollection>
  menuLinksCollection?: Maybe<OrganizationPageMenuLinksCollection>
  newsTag?: Maybe<GenericTag>
  organization?: Maybe<Organization>
  secondaryMenu?: Maybe<LinkGroup>
  secondaryMenuItemsCollection?: Maybe<OrganizationPageSecondaryMenuItemsCollection>
  sidebarCardsCollection?: Maybe<OrganizationPageSidebarCardsCollection>
  slicesCollection?: Maybe<OrganizationPageSlicesCollection>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  theme?: Maybe<Scalars['String']>
  themeProperties?: Maybe<Scalars['JSON']>
  tilkynning?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageAlertBannerArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageBottomSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageDefaultHeaderImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageExternalLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageFooterItemsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageMenuItemsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageMenuLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageNewsTagArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageSecondaryMenuArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageSecondaryMenuItemsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageSidebarCardsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageThemeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageThemePropertiesArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageTilkynningArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationPage) */
export type OrganizationPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type OrganizationPageBottomSlicesCollection = {
  __typename?: 'OrganizationPageBottomSlicesCollection'
  items: Array<Maybe<OrganizationPageBottomSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageBottomSlicesItem =
  | LatestNewsSlice
  | LogoListSlice
  | OneColumnText
  | Timeline
  | TwoColumnText

export type OrganizationPageCollection = {
  __typename?: 'OrganizationPageCollection'
  items: Array<Maybe<OrganizationPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageExternalLinksCollection = {
  __typename?: 'OrganizationPageExternalLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<OrganizationPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OrganizationPageFilter>>>
  alertBanner?: InputMaybe<CfAlertBannerNestedFilter>
  alertBanner_exists?: InputMaybe<Scalars['Boolean']>
  bottomSlicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  defaultHeaderImage_exists?: InputMaybe<Scalars['Boolean']>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  externalLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  footerItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  menuItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  menuLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  newsTag?: InputMaybe<CfGenericTagNestedFilter>
  newsTag_exists?: InputMaybe<Scalars['Boolean']>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  secondaryMenu?: InputMaybe<CfLinkGroupNestedFilter>
  secondaryMenuItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  secondaryMenu_exists?: InputMaybe<Scalars['Boolean']>
  sidebarCardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  theme?: InputMaybe<Scalars['String']>
  themeProperties_exists?: InputMaybe<Scalars['Boolean']>
  theme_contains?: InputMaybe<Scalars['String']>
  theme_exists?: InputMaybe<Scalars['Boolean']>
  theme_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  theme_not?: InputMaybe<Scalars['String']>
  theme_not_contains?: InputMaybe<Scalars['String']>
  theme_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tilkynning?: InputMaybe<Scalars['String']>
  tilkynning_contains?: InputMaybe<Scalars['String']>
  tilkynning_exists?: InputMaybe<Scalars['Boolean']>
  tilkynning_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tilkynning_not?: InputMaybe<Scalars['String']>
  tilkynning_not_contains?: InputMaybe<Scalars['String']>
  tilkynning_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type OrganizationPageFooterItemsCollection = {
  __typename?: 'OrganizationPageFooterItemsCollection'
  items: Array<Maybe<FooterItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageLinkingCollections = {
  __typename?: 'OrganizationPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
}

export type OrganizationPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationPageLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationPageLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationPageLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationPageLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationPageMenuItemsCollection = {
  __typename?: 'OrganizationPageMenuItemsCollection'
  items: Array<Maybe<MenuLinkWithChildren>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageMenuLinksCollection = {
  __typename?: 'OrganizationPageMenuLinksCollection'
  items: Array<Maybe<LinkGroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum OrganizationPageOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  ThemeAsc = 'theme_ASC',
  ThemeDesc = 'theme_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type OrganizationPageSecondaryMenuItemsCollection = {
  __typename?: 'OrganizationPageSecondaryMenuItemsCollection'
  items: Array<Maybe<MenuLink>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageSidebarCardsCollection = {
  __typename?: 'OrganizationPageSidebarCardsCollection'
  items: Array<Maybe<OrganizationPageSidebarCardsItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageSidebarCardsItem =
  | SidebarCard
  | SliceConnectedComponent

export type OrganizationPageSlicesCollection = {
  __typename?: 'OrganizationPageSlicesCollection'
  items: Array<Maybe<OrganizationPageSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationPageSlicesItem =
  | AccordionSlice
  | BigBulletList
  | Districts
  | EmailSignup
  | EventSlice
  | FeaturedArticles
  | LifeEventPageListSlice
  | LogoListSlice
  | MultipleStatistics
  | OneColumnText
  | OverviewLinks
  | SectionHeading
  | StorySection
  | TabSection
  | Timeline
  | TwoColumnText

export type OrganizationPublishedMaterialSearchFilterGenericTagsCollection = {
  __typename?: 'OrganizationPublishedMaterialSearchFilterGenericTagsCollection'
  items: Array<Maybe<GenericTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpage = Entry & {
  __typename?: 'OrganizationSubpage'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<OrganizationSubpageDescription>
  featuredImage?: Maybe<Asset>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<OrganizationSubpageLinkingCollections>
  linksCollection?: Maybe<OrganizationSubpageLinksCollection>
  organizationPage?: Maybe<OrganizationPage>
  showTableOfContents?: Maybe<Scalars['Boolean']>
  sliceCustomRenderer?: Maybe<Scalars['String']>
  sliceExtraText?: Maybe<Scalars['String']>
  slicesCollection?: Maybe<OrganizationSubpageSlicesCollection>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  tilkynning?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageOrganizationPageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageShowTableOfContentsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageSliceCustomRendererArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageSliceExtraTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageTilkynningArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationSubpage) */
export type OrganizationSubpageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type OrganizationSubpageCollection = {
  __typename?: 'OrganizationSubpageCollection'
  items: Array<Maybe<OrganizationSubpage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationSubpageDescription = {
  __typename?: 'OrganizationSubpageDescription'
  json: Scalars['JSON']
  links: OrganizationSubpageDescriptionLinks
}

export type OrganizationSubpageDescriptionAssets = {
  __typename?: 'OrganizationSubpageDescriptionAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type OrganizationSubpageDescriptionEntries = {
  __typename?: 'OrganizationSubpageDescriptionEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type OrganizationSubpageDescriptionLinks = {
  __typename?: 'OrganizationSubpageDescriptionLinks'
  assets: OrganizationSubpageDescriptionAssets
  entries: OrganizationSubpageDescriptionEntries
}

export type OrganizationSubpageFilter = {
  AND?: InputMaybe<Array<InputMaybe<OrganizationSubpageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OrganizationSubpageFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_not_contains?: InputMaybe<Scalars['String']>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  organizationPage?: InputMaybe<CfOrganizationPageNestedFilter>
  organizationPage_exists?: InputMaybe<Scalars['Boolean']>
  showTableOfContents?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_exists?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_not?: InputMaybe<Scalars['Boolean']>
  sliceCustomRenderer?: InputMaybe<Scalars['String']>
  sliceCustomRenderer_contains?: InputMaybe<Scalars['String']>
  sliceCustomRenderer_exists?: InputMaybe<Scalars['Boolean']>
  sliceCustomRenderer_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sliceCustomRenderer_not?: InputMaybe<Scalars['String']>
  sliceCustomRenderer_not_contains?: InputMaybe<Scalars['String']>
  sliceCustomRenderer_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sliceExtraText?: InputMaybe<Scalars['String']>
  sliceExtraText_contains?: InputMaybe<Scalars['String']>
  sliceExtraText_exists?: InputMaybe<Scalars['Boolean']>
  sliceExtraText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sliceExtraText_not?: InputMaybe<Scalars['String']>
  sliceExtraText_not_contains?: InputMaybe<Scalars['String']>
  sliceExtraText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  tilkynning?: InputMaybe<Scalars['String']>
  tilkynning_contains?: InputMaybe<Scalars['String']>
  tilkynning_exists?: InputMaybe<Scalars['Boolean']>
  tilkynning_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tilkynning_not?: InputMaybe<Scalars['String']>
  tilkynning_not_contains?: InputMaybe<Scalars['String']>
  tilkynning_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type OrganizationSubpageLinkingCollections = {
  __typename?: 'OrganizationSubpageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
}

export type OrganizationSubpageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationSubpageLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationSubpageLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationSubpageLinksCollection = {
  __typename?: 'OrganizationSubpageLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum OrganizationSubpageOrder {
  IntroAsc = 'intro_ASC',
  IntroDesc = 'intro_DESC',
  ShowTableOfContentsAsc = 'showTableOfContents_ASC',
  ShowTableOfContentsDesc = 'showTableOfContents_DESC',
  SliceCustomRendererAsc = 'sliceCustomRenderer_ASC',
  SliceCustomRendererDesc = 'sliceCustomRenderer_DESC',
  SliceExtraTextAsc = 'sliceExtraText_ASC',
  SliceExtraTextDesc = 'sliceExtraText_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type OrganizationSubpageSlicesCollection = {
  __typename?: 'OrganizationSubpageSlicesCollection'
  items: Array<Maybe<OrganizationSubpageSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationSubpageSlicesItem =
  | AccordionSlice
  | BigBulletList
  | ContactUs
  | Districts
  | EmailSignup
  | EventSlice
  | FeaturedArticles
  | LatestNewsSlice
  | LifeEventPageListSlice
  | MultipleStatistics
  | OneColumnText
  | OverviewLinks
  | PowerBiSlice
  | SliceConnectedComponent
  | TabSection
  | TeamList
  | TellUsAStory
  | TwoColumnText

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationTag) */
export type OrganizationTag = Entry & {
  __typename?: 'OrganizationTag'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<OrganizationTagLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationTag) */
export type OrganizationTagLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/organizationTag) */
export type OrganizationTagTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type OrganizationTagCollection = {
  __typename?: 'OrganizationTagCollection'
  items: Array<Maybe<OrganizationTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OrganizationTagFilter = {
  AND?: InputMaybe<Array<InputMaybe<OrganizationTagFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OrganizationTagFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type OrganizationTagLinkingCollections = {
  __typename?: 'OrganizationTagLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationCollection?: Maybe<OrganizationCollection>
}

export type OrganizationTagLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OrganizationTagLinkingCollectionsOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum OrganizationTagOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/overviewLinks) */
export type OverviewLinks = Entry & {
  __typename?: 'OverviewLinks'
  contentfulMetadata: ContentfulMetadata
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  link?: Maybe<Link>
  linkedFrom?: Maybe<OverviewLinksLinkingCollections>
  overviewLinksCollection?: Maybe<OverviewLinksOverviewLinksCollection>
  sys: Sys
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/overviewLinks) */
export type OverviewLinksHasBorderAboveArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/overviewLinks) */
export type OverviewLinksLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/overviewLinks) */
export type OverviewLinksLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/overviewLinks) */
export type OverviewLinksOverviewLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OverviewLinksCollection = {
  __typename?: 'OverviewLinksCollection'
  items: Array<Maybe<OverviewLinks>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type OverviewLinksFilter = {
  AND?: InputMaybe<Array<InputMaybe<OverviewLinksFilter>>>
  OR?: InputMaybe<Array<InputMaybe<OverviewLinksFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  hasBorderAbove?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_not?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  overviewLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type OverviewLinksLinkingCollections = {
  __typename?: 'OverviewLinksLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type OverviewLinksLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OverviewLinksLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OverviewLinksLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OverviewLinksLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type OverviewLinksLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum OverviewLinksOrder {
  HasBorderAboveAsc = 'hasBorderAbove_ASC',
  HasBorderAboveDesc = 'hasBorderAbove_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type OverviewLinksOverviewLinksCollection = {
  __typename?: 'OverviewLinksOverviewLinksCollection'
  items: Array<Maybe<IntroLinkImage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeader = Entry & {
  __typename?: 'PageHeader'
  contentfulMetadata: ContentfulMetadata
  introduction?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<PageHeaderLinkingCollections>
  linksCollection?: Maybe<PageHeaderLinksCollection>
  navigationText?: Maybe<Scalars['String']>
  slicesCollection?: Maybe<PageHeaderSlicesCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeaderIntroductionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeaderLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeaderLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeaderNavigationTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeaderSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/pageHeader) */
export type PageHeaderTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type PageHeaderCollection = {
  __typename?: 'PageHeaderCollection'
  items: Array<Maybe<PageHeader>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type PageHeaderFilter = {
  AND?: InputMaybe<Array<InputMaybe<PageHeaderFilter>>>
  OR?: InputMaybe<Array<InputMaybe<PageHeaderFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  introduction?: InputMaybe<Scalars['String']>
  introduction_contains?: InputMaybe<Scalars['String']>
  introduction_exists?: InputMaybe<Scalars['Boolean']>
  introduction_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  introduction_not?: InputMaybe<Scalars['String']>
  introduction_not_contains?: InputMaybe<Scalars['String']>
  introduction_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  navigationText?: InputMaybe<Scalars['String']>
  navigationText_contains?: InputMaybe<Scalars['String']>
  navigationText_exists?: InputMaybe<Scalars['Boolean']>
  navigationText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  navigationText_not?: InputMaybe<Scalars['String']>
  navigationText_not_contains?: InputMaybe<Scalars['String']>
  navigationText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type PageHeaderLinkingCollections = {
  __typename?: 'PageHeaderLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type PageHeaderLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type PageHeaderLinksCollection = {
  __typename?: 'PageHeaderLinksCollection'
  items: Array<Maybe<Link>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export enum PageHeaderOrder {
  NavigationTextAsc = 'navigationText_ASC',
  NavigationTextDesc = 'navigationText_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type PageHeaderSlicesCollection = {
  __typename?: 'PageHeaderSlicesCollection'
  items: Array<Maybe<PageHeaderSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type PageHeaderSlicesItem = SectionHeading | Timeline

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSlice = Entry & {
  __typename?: 'PowerBiSlice'
  config?: Maybe<Scalars['JSON']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<PowerBiSliceLinkingCollections>
  owner?: Maybe<Scalars['String']>
  reportId?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
  workSpaceId?: Maybe<Scalars['String']>
}

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSliceConfigArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSliceOwnerArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSliceReportIdArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A Slice that embeds a Power BI report [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/powerBiSlice) */
export type PowerBiSliceWorkSpaceIdArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type PowerBiSliceCollection = {
  __typename?: 'PowerBiSliceCollection'
  items: Array<Maybe<PowerBiSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type PowerBiSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<PowerBiSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<PowerBiSliceFilter>>>
  config_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  owner?: InputMaybe<Scalars['String']>
  owner_contains?: InputMaybe<Scalars['String']>
  owner_exists?: InputMaybe<Scalars['Boolean']>
  owner_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  owner_not?: InputMaybe<Scalars['String']>
  owner_not_contains?: InputMaybe<Scalars['String']>
  owner_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  reportId?: InputMaybe<Scalars['String']>
  reportId_contains?: InputMaybe<Scalars['String']>
  reportId_exists?: InputMaybe<Scalars['Boolean']>
  reportId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  reportId_not?: InputMaybe<Scalars['String']>
  reportId_not_contains?: InputMaybe<Scalars['String']>
  reportId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  workSpaceId?: InputMaybe<Scalars['String']>
  workSpaceId_contains?: InputMaybe<Scalars['String']>
  workSpaceId_exists?: InputMaybe<Scalars['Boolean']>
  workSpaceId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  workSpaceId_not?: InputMaybe<Scalars['String']>
  workSpaceId_not_contains?: InputMaybe<Scalars['String']>
  workSpaceId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type PowerBiSliceLinkingCollections = {
  __typename?: 'PowerBiSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
}

export type PowerBiSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type PowerBiSliceLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum PowerBiSliceOrder {
  OwnerAsc = 'owner_ASC',
  OwnerDesc = 'owner_DESC',
  ReportIdAsc = 'reportId_ASC',
  ReportIdDesc = 'reportId_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  WorkSpaceIdAsc = 'workSpaceId_ASC',
  WorkSpaceIdDesc = 'workSpaceId_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntry = Entry & {
  __typename?: 'ProcessEntry'
  buttonText?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<ProcessEntryLinkingCollections>
  openLinkInModal?: Maybe<Scalars['Boolean']>
  processAsset?: Maybe<Asset>
  processLink?: Maybe<Scalars['String']>
  processTitle?: Maybe<Scalars['String']>
  sys: Sys
  type?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryButtonTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryOpenLinkInModalArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryProcessAssetArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryProcessLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryProcessTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/processEntry) */
export type ProcessEntryTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ProcessEntryCollection = {
  __typename?: 'ProcessEntryCollection'
  items: Array<Maybe<ProcessEntry>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProcessEntryFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProcessEntryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ProcessEntryFilter>>>
  buttonText?: InputMaybe<Scalars['String']>
  buttonText_contains?: InputMaybe<Scalars['String']>
  buttonText_exists?: InputMaybe<Scalars['Boolean']>
  buttonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  buttonText_not?: InputMaybe<Scalars['String']>
  buttonText_not_contains?: InputMaybe<Scalars['String']>
  buttonText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  openLinkInModal?: InputMaybe<Scalars['Boolean']>
  openLinkInModal_exists?: InputMaybe<Scalars['Boolean']>
  openLinkInModal_not?: InputMaybe<Scalars['Boolean']>
  processAsset_exists?: InputMaybe<Scalars['Boolean']>
  processLink?: InputMaybe<Scalars['String']>
  processLink_contains?: InputMaybe<Scalars['String']>
  processLink_exists?: InputMaybe<Scalars['Boolean']>
  processLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processLink_not?: InputMaybe<Scalars['String']>
  processLink_not_contains?: InputMaybe<Scalars['String']>
  processLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processTitle?: InputMaybe<Scalars['String']>
  processTitle_contains?: InputMaybe<Scalars['String']>
  processTitle_exists?: InputMaybe<Scalars['Boolean']>
  processTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processTitle_not?: InputMaybe<Scalars['String']>
  processTitle_not_contains?: InputMaybe<Scalars['String']>
  processTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ProcessEntryLinkingCollections = {
  __typename?: 'ProcessEntryLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  vidspyrnaPageCollection?: Maybe<VidspyrnaPageCollection>
}

export type ProcessEntryLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ProcessEntryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ProcessEntryLinkingCollectionsVidspyrnaPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ProcessEntryOrder {
  ButtonTextAsc = 'buttonText_ASC',
  ButtonTextDesc = 'buttonText_DESC',
  OpenLinkInModalAsc = 'openLinkInModal_ASC',
  OpenLinkInModalDesc = 'openLinkInModal_DESC',
  ProcessTitleAsc = 'processTitle_ASC',
  ProcessTitleDesc = 'processTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPage = Entry & {
  __typename?: 'ProjectPage'
  backLink?: Maybe<Link>
  bottomSlicesCollection?: Maybe<ProjectPageBottomSlicesCollection>
  content?: Maybe<ProjectPageContent>
  contentIsFullWidth?: Maybe<Scalars['Boolean']>
  contentfulMetadata: ContentfulMetadata
  defaultHeaderBackgroundColor?: Maybe<Scalars['String']>
  defaultHeaderImage?: Maybe<Asset>
  featuredDescription?: Maybe<Scalars['String']>
  featuredImage?: Maybe<Asset>
  footerItemsCollection?: Maybe<ProjectPageFooterItemsCollection>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<ProjectPageLinkingCollections>
  namespace?: Maybe<UiConfiguration>
  newsTag?: Maybe<GenericTag>
  projectSubpagesCollection?: Maybe<ProjectPageProjectSubpagesCollection>
  sidebar?: Maybe<Scalars['Boolean']>
  sidebarLinksCollection?: Maybe<ProjectPageSidebarLinksCollection>
  slicesCollection?: Maybe<ProjectPageSlicesCollection>
  slug?: Maybe<Scalars['String']>
  stepper?: Maybe<Stepper>
  subtitle?: Maybe<Scalars['String']>
  sys: Sys
  theme?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageBackLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageBottomSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageContentIsFullWidthArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageDefaultHeaderBackgroundColorArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageDefaultHeaderImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageFeaturedDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageFooterItemsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageNamespaceArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageNewsTagArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageProjectSubpagesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageSidebarArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageSidebarLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageStepperArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageSubtitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageThemeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectPage) */
export type ProjectPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ProjectPageBottomSlicesCollection = {
  __typename?: 'ProjectPageBottomSlicesCollection'
  items: Array<Maybe<ProjectPageBottomSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectPageBottomSlicesItem =
  | LatestNewsSlice
  | LogoListSlice
  | OneColumnText
  | Timeline
  | TwoColumnText

export type ProjectPageCollection = {
  __typename?: 'ProjectPageCollection'
  items: Array<Maybe<ProjectPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectPageContent = {
  __typename?: 'ProjectPageContent'
  json: Scalars['JSON']
  links: ProjectPageContentLinks
}

export type ProjectPageContentAssets = {
  __typename?: 'ProjectPageContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type ProjectPageContentEntries = {
  __typename?: 'ProjectPageContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type ProjectPageContentLinks = {
  __typename?: 'ProjectPageContentLinks'
  assets: ProjectPageContentAssets
  entries: ProjectPageContentEntries
}

export type ProjectPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProjectPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ProjectPageFilter>>>
  backLink?: InputMaybe<CfLinkNestedFilter>
  backLink_exists?: InputMaybe<Scalars['Boolean']>
  bottomSlicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentIsFullWidth?: InputMaybe<Scalars['Boolean']>
  contentIsFullWidth_exists?: InputMaybe<Scalars['Boolean']>
  contentIsFullWidth_not?: InputMaybe<Scalars['Boolean']>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  defaultHeaderBackgroundColor?: InputMaybe<Scalars['String']>
  defaultHeaderBackgroundColor_contains?: InputMaybe<Scalars['String']>
  defaultHeaderBackgroundColor_exists?: InputMaybe<Scalars['Boolean']>
  defaultHeaderBackgroundColor_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  defaultHeaderBackgroundColor_not?: InputMaybe<Scalars['String']>
  defaultHeaderBackgroundColor_not_contains?: InputMaybe<Scalars['String']>
  defaultHeaderBackgroundColor_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  defaultHeaderImage_exists?: InputMaybe<Scalars['Boolean']>
  featuredDescription?: InputMaybe<Scalars['String']>
  featuredDescription_contains?: InputMaybe<Scalars['String']>
  featuredDescription_exists?: InputMaybe<Scalars['Boolean']>
  featuredDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  featuredDescription_not?: InputMaybe<Scalars['String']>
  featuredDescription_not_contains?: InputMaybe<Scalars['String']>
  featuredDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  footerItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  namespace?: InputMaybe<CfUiConfigurationNestedFilter>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  newsTag?: InputMaybe<CfGenericTagNestedFilter>
  newsTag_exists?: InputMaybe<Scalars['Boolean']>
  projectSubpagesCollection_exists?: InputMaybe<Scalars['Boolean']>
  sidebar?: InputMaybe<Scalars['Boolean']>
  sidebarLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sidebar_exists?: InputMaybe<Scalars['Boolean']>
  sidebar_not?: InputMaybe<Scalars['Boolean']>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  stepper?: InputMaybe<CfStepperNestedFilter>
  stepper_exists?: InputMaybe<Scalars['Boolean']>
  subtitle?: InputMaybe<Scalars['String']>
  subtitle_contains?: InputMaybe<Scalars['String']>
  subtitle_exists?: InputMaybe<Scalars['Boolean']>
  subtitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle_not?: InputMaybe<Scalars['String']>
  subtitle_not_contains?: InputMaybe<Scalars['String']>
  subtitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  theme?: InputMaybe<Scalars['String']>
  theme_contains?: InputMaybe<Scalars['String']>
  theme_exists?: InputMaybe<Scalars['Boolean']>
  theme_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  theme_not?: InputMaybe<Scalars['String']>
  theme_not_contains?: InputMaybe<Scalars['String']>
  theme_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ProjectPageFooterItemsCollection = {
  __typename?: 'ProjectPageFooterItemsCollection'
  items: Array<Maybe<FooterItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectPageLinkingCollections = {
  __typename?: 'ProjectPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  urlCollection?: Maybe<UrlCollection>
}

export type ProjectPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ProjectPageLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ProjectPageOrder {
  ContentIsFullWidthAsc = 'contentIsFullWidth_ASC',
  ContentIsFullWidthDesc = 'contentIsFullWidth_DESC',
  DefaultHeaderBackgroundColorAsc = 'defaultHeaderBackgroundColor_ASC',
  DefaultHeaderBackgroundColorDesc = 'defaultHeaderBackgroundColor_DESC',
  FeaturedDescriptionAsc = 'featuredDescription_ASC',
  FeaturedDescriptionDesc = 'featuredDescription_DESC',
  SidebarAsc = 'sidebar_ASC',
  SidebarDesc = 'sidebar_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  ThemeAsc = 'theme_ASC',
  ThemeDesc = 'theme_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ProjectPageProjectSubpagesCollection = {
  __typename?: 'ProjectPageProjectSubpagesCollection'
  items: Array<Maybe<ProjectSubpage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectPageSidebarLinksCollection = {
  __typename?: 'ProjectPageSidebarLinksCollection'
  items: Array<Maybe<LinkGroup>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectPageSlicesCollection = {
  __typename?: 'ProjectPageSlicesCollection'
  items: Array<Maybe<ProjectPageSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectPageSlicesItem =
  | AccordionSlice
  | BigBulletList
  | ContactUs
  | EmailSignup
  | EventSlice
  | FaqList
  | FeaturedArticles
  | LatestNewsSlice
  | MultipleStatistics
  | OneColumnText
  | OverviewLinks
  | SectionHeading
  | TabSection
  | TeamList
  | TwoColumnText

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpage = Entry & {
  __typename?: 'ProjectSubpage'
  content?: Maybe<ProjectSubpageContent>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<ProjectSubpageLinkingCollections>
  renderSlicesAsTabs?: Maybe<Scalars['Boolean']>
  slicesCollection?: Maybe<ProjectSubpageSlicesCollection>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpageContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpageRenderSlicesAsTabsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpageSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/projectSubpage) */
export type ProjectSubpageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type ProjectSubpageCollection = {
  __typename?: 'ProjectSubpageCollection'
  items: Array<Maybe<ProjectSubpage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectSubpageContent = {
  __typename?: 'ProjectSubpageContent'
  json: Scalars['JSON']
  links: ProjectSubpageContentLinks
}

export type ProjectSubpageContentAssets = {
  __typename?: 'ProjectSubpageContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type ProjectSubpageContentEntries = {
  __typename?: 'ProjectSubpageContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type ProjectSubpageContentLinks = {
  __typename?: 'ProjectSubpageContentLinks'
  assets: ProjectSubpageContentAssets
  entries: ProjectSubpageContentEntries
}

export type ProjectSubpageFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProjectSubpageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<ProjectSubpageFilter>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  renderSlicesAsTabs?: InputMaybe<Scalars['Boolean']>
  renderSlicesAsTabs_exists?: InputMaybe<Scalars['Boolean']>
  renderSlicesAsTabs_not?: InputMaybe<Scalars['Boolean']>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ProjectSubpageLinkingCollections = {
  __typename?: 'ProjectSubpageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type ProjectSubpageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type ProjectSubpageLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum ProjectSubpageOrder {
  RenderSlicesAsTabsAsc = 'renderSlicesAsTabs_ASC',
  RenderSlicesAsTabsDesc = 'renderSlicesAsTabs_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type ProjectSubpageSlicesCollection = {
  __typename?: 'ProjectSubpageSlicesCollection'
  items: Array<Maybe<ProjectSubpageSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type ProjectSubpageSlicesItem =
  | AccordionSlice
  | BigBulletList
  | ContactUs
  | Districts
  | EmailSignup
  | EventSlice
  | FaqList
  | FeaturedArticles
  | LatestNewsSlice
  | MultipleStatistics
  | OneColumnText
  | OverviewLinks
  | TabSection
  | TeamList
  | TellUsAStory
  | TwoColumnText

export type Query = {
  __typename?: 'Query'
  accordionSlice?: Maybe<AccordionSlice>
  accordionSliceCollection?: Maybe<AccordionSliceCollection>
  alertBanner?: Maybe<AlertBanner>
  alertBannerCollection?: Maybe<AlertBannerCollection>
  appUri?: Maybe<AppUri>
  appUriCollection?: Maybe<AppUriCollection>
  article?: Maybe<Article>
  articleCategory?: Maybe<ArticleCategory>
  articleCategoryCollection?: Maybe<ArticleCategoryCollection>
  articleCollection?: Maybe<ArticleCollection>
  articleGroup?: Maybe<ArticleGroup>
  articleGroupCollection?: Maybe<ArticleGroupCollection>
  articleSubgroup?: Maybe<ArticleSubgroup>
  articleSubgroupCollection?: Maybe<ArticleSubgroupCollection>
  asset?: Maybe<Asset>
  assetCollection?: Maybe<AssetCollection>
  auction?: Maybe<Auction>
  auctionCollection?: Maybe<AuctionCollection>
  bigBulletList?: Maybe<BigBulletList>
  bigBulletListCollection?: Maybe<BigBulletListCollection>
  card?: Maybe<Card>
  cardCollection?: Maybe<CardCollection>
  cardSection?: Maybe<CardSection>
  cardSectionCollection?: Maybe<CardSectionCollection>
  contactUs?: Maybe<ContactUs>
  contactUsCollection?: Maybe<ContactUsCollection>
  contentTypeLocation?: Maybe<ContentTypeLocation>
  contentTypeLocationCollection?: Maybe<ContentTypeLocationCollection>
  districts?: Maybe<Districts>
  districtsCollection?: Maybe<DistrictsCollection>
  emailSignup?: Maybe<EmailSignup>
  emailSignupCollection?: Maybe<EmailSignupCollection>
  embeddedVideo?: Maybe<EmbeddedVideo>
  embeddedVideoCollection?: Maybe<EmbeddedVideoCollection>
  enhancedAsset?: Maybe<EnhancedAsset>
  enhancedAssetCollection?: Maybe<EnhancedAssetCollection>
  entryCollection?: Maybe<EntryCollection>
  errorPage?: Maybe<ErrorPage>
  errorPageCollection?: Maybe<ErrorPageCollection>
  eventSlice?: Maybe<EventSlice>
  eventSliceCollection?: Maybe<EventSliceCollection>
  faqList?: Maybe<FaqList>
  faqListCollection?: Maybe<FaqListCollection>
  featured?: Maybe<Featured>
  featuredArticles?: Maybe<FeaturedArticles>
  featuredArticlesCollection?: Maybe<FeaturedArticlesCollection>
  featuredCollection?: Maybe<FeaturedCollection>
  footerItem?: Maybe<FooterItem>
  footerItemCollection?: Maybe<FooterItemCollection>
  form?: Maybe<Form>
  formCollection?: Maybe<FormCollection>
  formField?: Maybe<FormField>
  formFieldCollection?: Maybe<FormFieldCollection>
  frontpage?: Maybe<Frontpage>
  frontpageCollection?: Maybe<FrontpageCollection>
  frontpageSlider?: Maybe<FrontpageSlider>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  genericOverviewPage?: Maybe<GenericOverviewPage>
  genericOverviewPageCollection?: Maybe<GenericOverviewPageCollection>
  genericPage?: Maybe<GenericPage>
  genericPageCollection?: Maybe<GenericPageCollection>
  genericTag?: Maybe<GenericTag>
  genericTagCollection?: Maybe<GenericTagCollection>
  genericTagGroup?: Maybe<GenericTagGroup>
  genericTagGroupCollection?: Maybe<GenericTagGroupCollection>
  graphCard?: Maybe<GraphCard>
  graphCardCollection?: Maybe<GraphCardCollection>
  groupedMenu?: Maybe<GroupedMenu>
  groupedMenuCollection?: Maybe<GroupedMenuCollection>
  hnippTemplate?: Maybe<HnippTemplate>
  hnippTemplateCollection?: Maybe<HnippTemplateCollection>
  iconBullet?: Maybe<IconBullet>
  iconBulletCollection?: Maybe<IconBulletCollection>
  introLinkImage?: Maybe<IntroLinkImage>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  latestNewsSlice?: Maybe<LatestNewsSlice>
  latestNewsSliceCollection?: Maybe<LatestNewsSliceCollection>
  lifeEventPage?: Maybe<LifeEventPage>
  lifeEventPageCollection?: Maybe<LifeEventPageCollection>
  lifeEventPageListSlice?: Maybe<LifeEventPageListSlice>
  lifeEventPageListSliceCollection?: Maybe<LifeEventPageListSliceCollection>
  link?: Maybe<Link>
  linkCollection?: Maybe<LinkCollection>
  linkGroup?: Maybe<LinkGroup>
  linkGroupCollection?: Maybe<LinkGroupCollection>
  linkList?: Maybe<LinkList>
  linkListCollection?: Maybe<LinkListCollection>
  linkUrl?: Maybe<LinkUrl>
  linkUrlCollection?: Maybe<LinkUrlCollection>
  linkedPage?: Maybe<LinkedPage>
  linkedPageCollection?: Maybe<LinkedPageCollection>
  logoListSlice?: Maybe<LogoListSlice>
  logoListSliceCollection?: Maybe<LogoListSliceCollection>
  mailingListSignup?: Maybe<MailingListSignup>
  mailingListSignupCollection?: Maybe<MailingListSignupCollection>
  menu?: Maybe<Menu>
  menuCollection?: Maybe<MenuCollection>
  menuLink?: Maybe<MenuLink>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildren?: Maybe<MenuLinkWithChildren>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  multipleStatistics?: Maybe<MultipleStatistics>
  multipleStatisticsCollection?: Maybe<MultipleStatisticsCollection>
  namespace?: Maybe<Namespace>
  namespaceCollection?: Maybe<NamespaceCollection>
  news?: Maybe<News>
  newsCollection?: Maybe<NewsCollection>
  numberBullet?: Maybe<NumberBullet>
  numberBulletCollection?: Maybe<NumberBulletCollection>
  numberBulletSection?: Maybe<NumberBulletSection>
  numberBulletSectionCollection?: Maybe<NumberBulletSectionCollection>
  oneColumnText?: Maybe<OneColumnText>
  oneColumnTextCollection?: Maybe<OneColumnTextCollection>
  openDataPage?: Maybe<OpenDataPage>
  openDataPageCollection?: Maybe<OpenDataPageCollection>
  openDataSubpage?: Maybe<OpenDataSubpage>
  openDataSubpageCollection?: Maybe<OpenDataSubpageCollection>
  organization?: Maybe<Organization>
  organizationCollection?: Maybe<OrganizationCollection>
  organizationPage?: Maybe<OrganizationPage>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpage?: Maybe<OrganizationSubpage>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  organizationTag?: Maybe<OrganizationTag>
  organizationTagCollection?: Maybe<OrganizationTagCollection>
  overviewLinks?: Maybe<OverviewLinks>
  overviewLinksCollection?: Maybe<OverviewLinksCollection>
  pageHeader?: Maybe<PageHeader>
  pageHeaderCollection?: Maybe<PageHeaderCollection>
  powerBiSlice?: Maybe<PowerBiSlice>
  powerBiSliceCollection?: Maybe<PowerBiSliceCollection>
  processEntry?: Maybe<ProcessEntry>
  processEntryCollection?: Maybe<ProcessEntryCollection>
  projectPage?: Maybe<ProjectPage>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpage?: Maybe<ProjectSubpage>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
  questionAndAnswer?: Maybe<QuestionAndAnswer>
  questionAndAnswerCollection?: Maybe<QuestionAndAnswerCollection>
  sectionHeading?: Maybe<SectionHeading>
  sectionHeadingCollection?: Maybe<SectionHeadingCollection>
  sectionWithImage?: Maybe<SectionWithImage>
  sectionWithImageCollection?: Maybe<SectionWithImageCollection>
  sidebarCard?: Maybe<SidebarCard>
  sidebarCardCollection?: Maybe<SidebarCardCollection>
  sliceConnectedComponent?: Maybe<SliceConnectedComponent>
  sliceConnectedComponentCollection?: Maybe<SliceConnectedComponentCollection>
  statistic?: Maybe<Statistic>
  statisticCollection?: Maybe<StatisticCollection>
  statistics?: Maybe<Statistics>
  statisticsCard?: Maybe<StatisticsCard>
  statisticsCardCollection?: Maybe<StatisticsCardCollection>
  statisticsCollection?: Maybe<StatisticsCollection>
  step?: Maybe<Step>
  stepCollection?: Maybe<StepCollection>
  stepper?: Maybe<Stepper>
  stepperCollection?: Maybe<StepperCollection>
  story?: Maybe<Story>
  storyCollection?: Maybe<StoryCollection>
  storySection?: Maybe<StorySection>
  storySectionCollection?: Maybe<StorySectionCollection>
  subArticle?: Maybe<SubArticle>
  subArticleCollection?: Maybe<SubArticleCollection>
  subpageHeader?: Maybe<SubpageHeader>
  subpageHeaderCollection?: Maybe<SubpageHeaderCollection>
  supportCategory?: Maybe<SupportCategory>
  supportCategoryCollection?: Maybe<SupportCategoryCollection>
  supportQna?: Maybe<SupportQna>
  supportQnaCollection?: Maybe<SupportQnaCollection>
  supportSubCategory?: Maybe<SupportSubCategory>
  supportSubCategoryCollection?: Maybe<SupportSubCategoryCollection>
  tabContent?: Maybe<TabContent>
  tabContentCollection?: Maybe<TabContentCollection>
  tabSection?: Maybe<TabSection>
  tabSectionCollection?: Maybe<TabSectionCollection>
  tableSlice?: Maybe<TableSlice>
  tableSliceCollection?: Maybe<TableSliceCollection>
  teamList?: Maybe<TeamList>
  teamListCollection?: Maybe<TeamListCollection>
  teamMember?: Maybe<TeamMember>
  teamMemberCollection?: Maybe<TeamMemberCollection>
  tellUsAStory?: Maybe<TellUsAStory>
  tellUsAStoryCollection?: Maybe<TellUsAStoryCollection>
  testHnippField?: Maybe<TestHnippField>
  testHnippFieldCollection?: Maybe<TestHnippFieldCollection>
  timeline?: Maybe<Timeline>
  timelineCollection?: Maybe<TimelineCollection>
  timelineEvent?: Maybe<TimelineEvent>
  timelineEventCollection?: Maybe<TimelineEventCollection>
  twoColumnText?: Maybe<TwoColumnText>
  twoColumnTextCollection?: Maybe<TwoColumnTextCollection>
  uiConfiguration?: Maybe<UiConfiguration>
  uiConfigurationCollection?: Maybe<UiConfigurationCollection>
  url?: Maybe<Url>
  urlCollection?: Maybe<UrlCollection>
  vidspyrnaFeaturedNews?: Maybe<VidspyrnaFeaturedNews>
  vidspyrnaFeaturedNewsCollection?: Maybe<VidspyrnaFeaturedNewsCollection>
  vidspyrnaFlokkur?: Maybe<VidspyrnaFlokkur>
  vidspyrnaFlokkurCollection?: Maybe<VidspyrnaFlokkurCollection>
  vidspyrnaFrontpage?: Maybe<VidspyrnaFrontpage>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
  vidspyrnaPage?: Maybe<VidspyrnaPage>
  vidspyrnaPageCollection?: Maybe<VidspyrnaPageCollection>
  vidspyrnaTag?: Maybe<VidspyrnaTag>
  vidspyrnaTagCollection?: Maybe<VidspyrnaTagCollection>
}

export type QueryAccordionSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryAccordionSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<AccordionSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AccordionSliceFilter>
}

export type QueryAlertBannerArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryAlertBannerCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<AlertBannerOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AlertBannerFilter>
}

export type QueryAppUriArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryAppUriCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<AppUriOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AppUriFilter>
}

export type QueryArticleArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryArticleCategoryArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryArticleCategoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ArticleCategoryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ArticleCategoryFilter>
}

export type QueryArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ArticleOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ArticleFilter>
}

export type QueryArticleGroupArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryArticleGroupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ArticleGroupOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ArticleGroupFilter>
}

export type QueryArticleSubgroupArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryArticleSubgroupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ArticleSubgroupOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ArticleSubgroupFilter>
}

export type QueryAssetArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<AssetOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AssetFilter>
}

export type QueryAuctionArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryAuctionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<AuctionOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AuctionFilter>
}

export type QueryBigBulletListArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryBigBulletListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<BigBulletListOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<BigBulletListFilter>
}

export type QueryCardArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<CardOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<CardFilter>
}

export type QueryCardSectionArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryCardSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<CardSectionOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<CardSectionFilter>
}

export type QueryContactUsArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryContactUsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ContactUsOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ContactUsFilter>
}

export type QueryContentTypeLocationArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryContentTypeLocationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ContentTypeLocationOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ContentTypeLocationFilter>
}

export type QueryDistrictsArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryDistrictsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<DistrictsOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<DistrictsFilter>
}

export type QueryEmailSignupArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryEmailSignupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<EmailSignupOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<EmailSignupFilter>
}

export type QueryEmbeddedVideoArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryEmbeddedVideoCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<EmbeddedVideoOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<EmbeddedVideoFilter>
}

export type QueryEnhancedAssetArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryEnhancedAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<EnhancedAssetOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<EnhancedAssetFilter>
}

export type QueryEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<EntryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<EntryFilter>
}

export type QueryErrorPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryErrorPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ErrorPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ErrorPageFilter>
}

export type QueryEventSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryEventSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<EventSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<EventSliceFilter>
}

export type QueryFaqListArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFaqListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FaqListOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FaqListFilter>
}

export type QueryFeaturedArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFeaturedArticlesArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFeaturedArticlesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FeaturedArticlesOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FeaturedArticlesFilter>
}

export type QueryFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FeaturedOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FeaturedFilter>
}

export type QueryFooterItemArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFooterItemCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FooterItemOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FooterItemFilter>
}

export type QueryFormArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFormCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FormOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FormFilter>
}

export type QueryFormFieldArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFormFieldCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FormFieldOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FormFieldFilter>
}

export type QueryFrontpageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FrontpageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FrontpageFilter>
}

export type QueryFrontpageSliderArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<FrontpageSliderOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FrontpageSliderFilter>
}

export type QueryGenericOverviewPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryGenericOverviewPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<GenericOverviewPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<GenericOverviewPageFilter>
}

export type QueryGenericPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryGenericPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<GenericPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<GenericPageFilter>
}

export type QueryGenericTagArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryGenericTagCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<GenericTagOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<GenericTagFilter>
}

export type QueryGenericTagGroupArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryGenericTagGroupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<GenericTagGroupOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<GenericTagGroupFilter>
}

export type QueryGraphCardArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryGraphCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<GraphCardOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<GraphCardFilter>
}

export type QueryGroupedMenuArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryGroupedMenuCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<GroupedMenuOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<GroupedMenuFilter>
}

export type QueryHnippTemplateArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryHnippTemplateCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<HnippTemplateOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<HnippTemplateFilter>
}

export type QueryIconBulletArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryIconBulletCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<IconBulletOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<IconBulletFilter>
}

export type QueryIntroLinkImageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<IntroLinkImageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<IntroLinkImageFilter>
}

export type QueryLatestNewsSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLatestNewsSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LatestNewsSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LatestNewsSliceFilter>
}

export type QueryLifeEventPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLifeEventPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LifeEventPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LifeEventPageFilter>
}

export type QueryLifeEventPageListSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLifeEventPageListSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LifeEventPageListSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LifeEventPageListSliceFilter>
}

export type QueryLinkArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LinkOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LinkFilter>
}

export type QueryLinkGroupArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLinkGroupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LinkGroupOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LinkGroupFilter>
}

export type QueryLinkListArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLinkListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LinkListOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LinkListFilter>
}

export type QueryLinkUrlArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLinkUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LinkUrlOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LinkUrlFilter>
}

export type QueryLinkedPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLinkedPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LinkedPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LinkedPageFilter>
}

export type QueryLogoListSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryLogoListSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<LogoListSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<LogoListSliceFilter>
}

export type QueryMailingListSignupArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryMailingListSignupCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<MailingListSignupOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MailingListSignupFilter>
}

export type QueryMenuArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryMenuCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<MenuOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MenuFilter>
}

export type QueryMenuLinkArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<MenuLinkOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MenuLinkFilter>
}

export type QueryMenuLinkWithChildrenArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<MenuLinkWithChildrenOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MenuLinkWithChildrenFilter>
}

export type QueryMultipleStatisticsArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryMultipleStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<MultipleStatisticsOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MultipleStatisticsFilter>
}

export type QueryNamespaceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryNamespaceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<NamespaceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<NamespaceFilter>
}

export type QueryNewsArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<NewsOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<NewsFilter>
}

export type QueryNumberBulletArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryNumberBulletCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<NumberBulletOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<NumberBulletFilter>
}

export type QueryNumberBulletSectionArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryNumberBulletSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<NumberBulletSectionOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<NumberBulletSectionFilter>
}

export type QueryOneColumnTextArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOneColumnTextCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OneColumnTextOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OneColumnTextFilter>
}

export type QueryOpenDataPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOpenDataPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OpenDataPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OpenDataPageFilter>
}

export type QueryOpenDataSubpageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOpenDataSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OpenDataSubpageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OpenDataSubpageFilter>
}

export type QueryOrganizationArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OrganizationOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OrganizationFilter>
}

export type QueryOrganizationPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OrganizationPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OrganizationPageFilter>
}

export type QueryOrganizationSubpageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OrganizationSubpageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OrganizationSubpageFilter>
}

export type QueryOrganizationTagArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOrganizationTagCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OrganizationTagOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OrganizationTagFilter>
}

export type QueryOverviewLinksArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryOverviewLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<OverviewLinksOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OverviewLinksFilter>
}

export type QueryPageHeaderArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryPageHeaderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<PageHeaderOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<PageHeaderFilter>
}

export type QueryPowerBiSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryPowerBiSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<PowerBiSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<PowerBiSliceFilter>
}

export type QueryProcessEntryArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryProcessEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ProcessEntryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ProcessEntryFilter>
}

export type QueryProjectPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ProjectPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ProjectPageFilter>
}

export type QueryProjectSubpageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<ProjectSubpageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ProjectSubpageFilter>
}

export type QueryQuestionAndAnswerArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryQuestionAndAnswerCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<QuestionAndAnswerOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<QuestionAndAnswerFilter>
}

export type QuerySectionHeadingArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySectionHeadingCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SectionHeadingOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SectionHeadingFilter>
}

export type QuerySectionWithImageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySectionWithImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SectionWithImageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SectionWithImageFilter>
}

export type QuerySidebarCardArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySidebarCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SidebarCardOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SidebarCardFilter>
}

export type QuerySliceConnectedComponentArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySliceConnectedComponentCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SliceConnectedComponentOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SliceConnectedComponentFilter>
}

export type QueryStatisticArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStatisticCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StatisticOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StatisticFilter>
}

export type QueryStatisticsArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStatisticsCardArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStatisticsCardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StatisticsCardOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StatisticsCardFilter>
}

export type QueryStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StatisticsOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StatisticsFilter>
}

export type QueryStepArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStepCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StepOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StepFilter>
}

export type QueryStepperArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStepperCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StepperOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StepperFilter>
}

export type QueryStoryArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StoryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StoryFilter>
}

export type QueryStorySectionArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryStorySectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<StorySectionOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<StorySectionFilter>
}

export type QuerySubArticleArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySubArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SubArticleOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SubArticleFilter>
}

export type QuerySubpageHeaderArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySubpageHeaderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SubpageHeaderOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SubpageHeaderFilter>
}

export type QuerySupportCategoryArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySupportCategoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SupportCategoryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SupportCategoryFilter>
}

export type QuerySupportQnaArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySupportQnaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SupportQnaOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SupportQnaFilter>
}

export type QuerySupportSubCategoryArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QuerySupportSubCategoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<SupportSubCategoryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<SupportSubCategoryFilter>
}

export type QueryTabContentArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTabContentCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TabContentOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TabContentFilter>
}

export type QueryTabSectionArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTabSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TabSectionOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TabSectionFilter>
}

export type QueryTableSliceArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTableSliceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TableSliceOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TableSliceFilter>
}

export type QueryTeamListArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTeamListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TeamListOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TeamListFilter>
}

export type QueryTeamMemberArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTeamMemberCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TeamMemberOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TeamMemberFilter>
}

export type QueryTellUsAStoryArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTellUsAStoryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TellUsAStoryOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TellUsAStoryFilter>
}

export type QueryTestHnippFieldArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTestHnippFieldCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TestHnippFieldOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TestHnippFieldFilter>
}

export type QueryTimelineArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTimelineCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TimelineOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TimelineFilter>
}

export type QueryTimelineEventArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTimelineEventCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TimelineEventOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TimelineEventFilter>
}

export type QueryTwoColumnTextArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryTwoColumnTextCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<TwoColumnTextOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TwoColumnTextFilter>
}

export type QueryUiConfigurationArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryUiConfigurationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<UiConfigurationOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<UiConfigurationFilter>
}

export type QueryUrlArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<UrlOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<UrlFilter>
}

export type QueryVidspyrnaFeaturedNewsArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryVidspyrnaFeaturedNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<VidspyrnaFeaturedNewsOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VidspyrnaFeaturedNewsFilter>
}

export type QueryVidspyrnaFlokkurArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryVidspyrnaFlokkurCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<VidspyrnaFlokkurOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VidspyrnaFlokkurFilter>
}

export type QueryVidspyrnaFrontpageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<VidspyrnaFrontpageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VidspyrnaFrontpageFilter>
}

export type QueryVidspyrnaPageArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryVidspyrnaPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<VidspyrnaPageOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VidspyrnaPageFilter>
}

export type QueryVidspyrnaTagArgs = {
  id: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type QueryVidspyrnaTagCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Array<InputMaybe<VidspyrnaTagOrder>>>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VidspyrnaTagFilter>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/questionAndAnswer) */
export type QuestionAndAnswer = Entry & {
  __typename?: 'QuestionAndAnswer'
  answer?: Maybe<QuestionAndAnswerAnswer>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<QuestionAndAnswerLinkingCollections>
  publishDate?: Maybe<Scalars['DateTime']>
  question?: Maybe<Scalars['String']>
  sys: Sys
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/questionAndAnswer) */
export type QuestionAndAnswerAnswerArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/questionAndAnswer) */
export type QuestionAndAnswerLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/questionAndAnswer) */
export type QuestionAndAnswerPublishDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/questionAndAnswer) */
export type QuestionAndAnswerQuestionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QuestionAndAnswerAnswer = {
  __typename?: 'QuestionAndAnswerAnswer'
  json: Scalars['JSON']
  links: QuestionAndAnswerAnswerLinks
}

export type QuestionAndAnswerAnswerAssets = {
  __typename?: 'QuestionAndAnswerAnswerAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type QuestionAndAnswerAnswerEntries = {
  __typename?: 'QuestionAndAnswerAnswerEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type QuestionAndAnswerAnswerLinks = {
  __typename?: 'QuestionAndAnswerAnswerLinks'
  assets: QuestionAndAnswerAnswerAssets
  entries: QuestionAndAnswerAnswerEntries
}

export type QuestionAndAnswerCollection = {
  __typename?: 'QuestionAndAnswerCollection'
  items: Array<Maybe<QuestionAndAnswer>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type QuestionAndAnswerFilter = {
  AND?: InputMaybe<Array<InputMaybe<QuestionAndAnswerFilter>>>
  OR?: InputMaybe<Array<InputMaybe<QuestionAndAnswerFilter>>>
  answer_contains?: InputMaybe<Scalars['String']>
  answer_exists?: InputMaybe<Scalars['Boolean']>
  answer_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  publishDate?: InputMaybe<Scalars['DateTime']>
  publishDate_exists?: InputMaybe<Scalars['Boolean']>
  publishDate_gt?: InputMaybe<Scalars['DateTime']>
  publishDate_gte?: InputMaybe<Scalars['DateTime']>
  publishDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  publishDate_lt?: InputMaybe<Scalars['DateTime']>
  publishDate_lte?: InputMaybe<Scalars['DateTime']>
  publishDate_not?: InputMaybe<Scalars['DateTime']>
  publishDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  question?: InputMaybe<Scalars['String']>
  question_contains?: InputMaybe<Scalars['String']>
  question_exists?: InputMaybe<Scalars['Boolean']>
  question_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  question_not?: InputMaybe<Scalars['String']>
  question_not_contains?: InputMaybe<Scalars['String']>
  question_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
}

export type QuestionAndAnswerLinkingCollections = {
  __typename?: 'QuestionAndAnswerLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  faqListCollection?: Maybe<FaqListCollection>
}

export type QuestionAndAnswerLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type QuestionAndAnswerLinkingCollectionsFaqListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum QuestionAndAnswerOrder {
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** Heading with title and description for separating page sections [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionHeading) */
export type SectionHeading = Entry & {
  __typename?: 'SectionHeading'
  body?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<SectionHeadingLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Heading with title and description for separating page sections [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionHeading) */
export type SectionHeadingBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Heading with title and description for separating page sections [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionHeading) */
export type SectionHeadingLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Heading with title and description for separating page sections [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionHeading) */
export type SectionHeadingTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SectionHeadingCollection = {
  __typename?: 'SectionHeadingCollection'
  items: Array<Maybe<SectionHeading>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SectionHeadingFilter = {
  AND?: InputMaybe<Array<InputMaybe<SectionHeadingFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SectionHeadingFilter>>>
  body?: InputMaybe<Scalars['String']>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  body_not?: InputMaybe<Scalars['String']>
  body_not_contains?: InputMaybe<Scalars['String']>
  body_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SectionHeadingLinkingCollections = {
  __typename?: 'SectionHeadingLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  pageHeaderCollection?: Maybe<PageHeaderCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type SectionHeadingLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SectionHeadingLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SectionHeadingLinkingCollectionsPageHeaderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SectionHeadingLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SectionHeadingOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionWithImage) */
export type SectionWithImage = Entry & {
  __typename?: 'SectionWithImage'
  body?: Maybe<SectionWithImageBody>
  contentfulMetadata: ContentfulMetadata
  image?: Maybe<Asset>
  linkedFrom?: Maybe<SectionWithImageLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionWithImage) */
export type SectionWithImageBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionWithImage) */
export type SectionWithImageImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionWithImage) */
export type SectionWithImageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sectionWithImage) */
export type SectionWithImageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SectionWithImageBody = {
  __typename?: 'SectionWithImageBody'
  json: Scalars['JSON']
  links: SectionWithImageBodyLinks
}

export type SectionWithImageBodyAssets = {
  __typename?: 'SectionWithImageBodyAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type SectionWithImageBodyEntries = {
  __typename?: 'SectionWithImageBodyEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type SectionWithImageBodyLinks = {
  __typename?: 'SectionWithImageBodyLinks'
  assets: SectionWithImageBodyAssets
  entries: SectionWithImageBodyEntries
}

export type SectionWithImageCollection = {
  __typename?: 'SectionWithImageCollection'
  items: Array<Maybe<SectionWithImage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SectionWithImageFilter = {
  AND?: InputMaybe<Array<InputMaybe<SectionWithImageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SectionWithImageFilter>>>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  image_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SectionWithImageLinkingCollections = {
  __typename?: 'SectionWithImageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type SectionWithImageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SectionWithImageOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCard = Entry & {
  __typename?: 'SidebarCard'
  content?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  image?: Maybe<Asset>
  link?: Maybe<Link>
  linkedFrom?: Maybe<SidebarCardLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCardContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCardImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCardLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCardLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCardTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sidebarCard) */
export type SidebarCardTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SidebarCardCollection = {
  __typename?: 'SidebarCardCollection'
  items: Array<Maybe<SidebarCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SidebarCardFilter = {
  AND?: InputMaybe<Array<InputMaybe<SidebarCardFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SidebarCardFilter>>>
  content?: InputMaybe<Scalars['String']>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  content_not?: InputMaybe<Scalars['String']>
  content_not_contains?: InputMaybe<Scalars['String']>
  content_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  image_exists?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<CfLinkNestedFilter>
  link_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SidebarCardLinkingCollections = {
  __typename?: 'SidebarCardLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
}

export type SidebarCardLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SidebarCardLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SidebarCardOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sliceConnectedComponent) */
export type SliceConnectedComponent = Entry & {
  __typename?: 'SliceConnectedComponent'
  config?: Maybe<Scalars['JSON']>
  contentfulMetadata: ContentfulMetadata
  json?: Maybe<Scalars['JSON']>
  linkedFrom?: Maybe<SliceConnectedComponentLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sliceConnectedComponent) */
export type SliceConnectedComponentConfigArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sliceConnectedComponent) */
export type SliceConnectedComponentJsonArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sliceConnectedComponent) */
export type SliceConnectedComponentLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sliceConnectedComponent) */
export type SliceConnectedComponentTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/sliceConnectedComponent) */
export type SliceConnectedComponentTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SliceConnectedComponentCollection = {
  __typename?: 'SliceConnectedComponentCollection'
  items: Array<Maybe<SliceConnectedComponent>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SliceConnectedComponentFilter = {
  AND?: InputMaybe<Array<InputMaybe<SliceConnectedComponentFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SliceConnectedComponentFilter>>>
  config_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  json_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SliceConnectedComponentLinkingCollections = {
  __typename?: 'SliceConnectedComponentLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
}

export type SliceConnectedComponentLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SliceConnectedComponentLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SliceConnectedComponentLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SliceConnectedComponentOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistic) */
export type Statistic = Entry & {
  __typename?: 'Statistic'
  contentfulMetadata: ContentfulMetadata
  label?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<StatisticLinkingCollections>
  sys: Sys
  value?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistic) */
export type StatisticLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistic) */
export type StatisticLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistic) */
export type StatisticValueArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type StatisticCollection = {
  __typename?: 'StatisticCollection'
  items: Array<Maybe<Statistic>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StatisticFilter = {
  AND?: InputMaybe<Array<InputMaybe<StatisticFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StatisticFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  label?: InputMaybe<Scalars['String']>
  label_contains?: InputMaybe<Scalars['String']>
  label_exists?: InputMaybe<Scalars['Boolean']>
  label_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  label_not?: InputMaybe<Scalars['String']>
  label_not_contains?: InputMaybe<Scalars['String']>
  label_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  value?: InputMaybe<Scalars['String']>
  value_contains?: InputMaybe<Scalars['String']>
  value_exists?: InputMaybe<Scalars['Boolean']>
  value_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  value_not?: InputMaybe<Scalars['String']>
  value_not_contains?: InputMaybe<Scalars['String']>
  value_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StatisticLinkingCollections = {
  __typename?: 'StatisticLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  statisticsCollection?: Maybe<StatisticsCollection>
}

export type StatisticLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StatisticLinkingCollectionsStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StatisticOrder {
  LabelAsc = 'label_ASC',
  LabelDesc = 'label_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  ValueAsc = 'value_ASC',
  ValueDesc = 'value_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistics) */
export type Statistics = Entry & {
  __typename?: 'Statistics'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<StatisticsLinkingCollections>
  statisticsCollection?: Maybe<StatisticsStatisticsCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistics) */
export type StatisticsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistics) */
export type StatisticsStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statistics) */
export type StatisticsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Statistic Card for Open data page and open data dashboards. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statisticsCard) */
export type StatisticsCard = Entry & {
  __typename?: 'StatisticsCard'
  contentfulMetadata: ContentfulMetadata
  image?: Maybe<Asset>
  linkedFrom?: Maybe<StatisticsCardLinkingCollections>
  statistic?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Statistic Card for Open data page and open data dashboards. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statisticsCard) */
export type StatisticsCardImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Statistic Card for Open data page and open data dashboards. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statisticsCard) */
export type StatisticsCardLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Statistic Card for Open data page and open data dashboards. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statisticsCard) */
export type StatisticsCardStatisticArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Statistic Card for Open data page and open data dashboards. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/statisticsCard) */
export type StatisticsCardTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type StatisticsCardCollection = {
  __typename?: 'StatisticsCardCollection'
  items: Array<Maybe<StatisticsCard>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StatisticsCardFilter = {
  AND?: InputMaybe<Array<InputMaybe<StatisticsCardFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StatisticsCardFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  image_exists?: InputMaybe<Scalars['Boolean']>
  statistic?: InputMaybe<Scalars['String']>
  statistic_contains?: InputMaybe<Scalars['String']>
  statistic_exists?: InputMaybe<Scalars['Boolean']>
  statistic_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  statistic_not?: InputMaybe<Scalars['String']>
  statistic_not_contains?: InputMaybe<Scalars['String']>
  statistic_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StatisticsCardLinkingCollections = {
  __typename?: 'StatisticsCardLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  openDataPageCollection?: Maybe<OpenDataPageCollection>
  openDataSubpageCollection?: Maybe<OpenDataSubpageCollection>
}

export type StatisticsCardLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StatisticsCardLinkingCollectionsOpenDataPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StatisticsCardLinkingCollectionsOpenDataSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StatisticsCardOrder {
  StatisticAsc = 'statistic_ASC',
  StatisticDesc = 'statistic_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type StatisticsCollection = {
  __typename?: 'StatisticsCollection'
  items: Array<Maybe<Statistics>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StatisticsFilter = {
  AND?: InputMaybe<Array<InputMaybe<StatisticsFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StatisticsFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  statisticsCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StatisticsLinkingCollections = {
  __typename?: 'StatisticsLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  multipleStatisticsCollection?: Maybe<MultipleStatisticsCollection>
}

export type StatisticsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StatisticsLinkingCollectionsMultipleStatisticsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StatisticsOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type StatisticsStatisticsCollection = {
  __typename?: 'StatisticsStatisticsCollection'
  items: Array<Maybe<Statistic>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type Step = Entry & {
  __typename?: 'Step'
  config?: Maybe<Scalars['JSON']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<StepLinkingCollections>
  slug?: Maybe<Scalars['String']>
  stepType?: Maybe<Scalars['String']>
  subtitle?: Maybe<StepSubtitle>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type StepConfigArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type StepLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type StepSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type StepStepTypeArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type StepSubtitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Step for stepper [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/step) */
export type StepTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type StepCollection = {
  __typename?: 'StepCollection'
  items: Array<Maybe<Step>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StepFilter = {
  AND?: InputMaybe<Array<InputMaybe<StepFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StepFilter>>>
  config_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  stepType?: InputMaybe<Scalars['String']>
  stepType_contains?: InputMaybe<Scalars['String']>
  stepType_exists?: InputMaybe<Scalars['Boolean']>
  stepType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  stepType_not?: InputMaybe<Scalars['String']>
  stepType_not_contains?: InputMaybe<Scalars['String']>
  stepType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle_contains?: InputMaybe<Scalars['String']>
  subtitle_exists?: InputMaybe<Scalars['Boolean']>
  subtitle_not_contains?: InputMaybe<Scalars['String']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StepLinkingCollections = {
  __typename?: 'StepLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  stepperCollection?: Maybe<StepperCollection>
}

export type StepLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StepLinkingCollectionsStepperCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StepOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  StepTypeAsc = 'stepType_ASC',
  StepTypeDesc = 'stepType_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type StepSubtitle = {
  __typename?: 'StepSubtitle'
  json: Scalars['JSON']
  links: StepSubtitleLinks
}

export type StepSubtitleAssets = {
  __typename?: 'StepSubtitleAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type StepSubtitleEntries = {
  __typename?: 'StepSubtitleEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type StepSubtitleLinks = {
  __typename?: 'StepSubtitleLinks'
  assets: StepSubtitleAssets
  entries: StepSubtitleEntries
}

/** Used for asking users questions and returning an answer. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/stepper) */
export type Stepper = Entry & {
  __typename?: 'Stepper'
  config?: Maybe<Scalars['JSON']>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<StepperLinkingCollections>
  stepsCollection?: Maybe<StepperStepsCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Used for asking users questions and returning an answer. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/stepper) */
export type StepperConfigArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Used for asking users questions and returning an answer. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/stepper) */
export type StepperLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Used for asking users questions and returning an answer. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/stepper) */
export type StepperStepsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Used for asking users questions and returning an answer. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/stepper) */
export type StepperTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type StepperCollection = {
  __typename?: 'StepperCollection'
  items: Array<Maybe<Stepper>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StepperFilter = {
  AND?: InputMaybe<Array<InputMaybe<StepperFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StepperFilter>>>
  config_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  stepsCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StepperLinkingCollections = {
  __typename?: 'StepperLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type StepperLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StepperLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StepperLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StepperOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type StepperStepsCollection = {
  __typename?: 'StepperStepsCollection'
  items: Array<Maybe<Step>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type Story = Entry & {
  __typename?: 'Story'
  body?: Maybe<StoryBody>
  contentfulMetadata: ContentfulMetadata
  intro?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  link?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<StoryLinkingCollections>
  linkedPage?: Maybe<StoryLinkedPage>
  logo?: Maybe<Asset>
  page?: Maybe<LinkedPage>
  readMoreText?: Maybe<Scalars['String']>
  storyLink?: Maybe<Link>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryLinkedPageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryLogoArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryPageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryReadMoreTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryStoryLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/story) */
export type StoryTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type StoryBody = {
  __typename?: 'StoryBody'
  json: Scalars['JSON']
  links: StoryBodyLinks
}

export type StoryBodyAssets = {
  __typename?: 'StoryBodyAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type StoryBodyEntries = {
  __typename?: 'StoryBodyEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type StoryBodyLinks = {
  __typename?: 'StoryBodyLinks'
  assets: StoryBodyAssets
  entries: StoryBodyEntries
}

export type StoryCollection = {
  __typename?: 'StoryCollection'
  items: Array<Maybe<Story>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<StoryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StoryFilter>>>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  label?: InputMaybe<Scalars['String']>
  label_contains?: InputMaybe<Scalars['String']>
  label_exists?: InputMaybe<Scalars['Boolean']>
  label_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  label_not?: InputMaybe<Scalars['String']>
  label_not_contains?: InputMaybe<Scalars['String']>
  label_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link?: InputMaybe<Scalars['String']>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkedPage_exists?: InputMaybe<Scalars['Boolean']>
  logo_exists?: InputMaybe<Scalars['Boolean']>
  page?: InputMaybe<CfLinkedPageNestedFilter>
  page_exists?: InputMaybe<Scalars['Boolean']>
  readMoreText?: InputMaybe<Scalars['String']>
  readMoreText_contains?: InputMaybe<Scalars['String']>
  readMoreText_exists?: InputMaybe<Scalars['Boolean']>
  readMoreText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  readMoreText_not?: InputMaybe<Scalars['String']>
  readMoreText_not_contains?: InputMaybe<Scalars['String']>
  readMoreText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  storyLink?: InputMaybe<CfLinkNestedFilter>
  storyLink_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StoryLinkedPage = Article | News

export type StoryLinkingCollections = {
  __typename?: 'StoryLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  storySectionCollection?: Maybe<StorySectionCollection>
}

export type StoryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StoryLinkingCollectionsStorySectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StoryOrder {
  LabelAsc = 'label_ASC',
  LabelDesc = 'label_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  ReadMoreTextAsc = 'readMoreText_ASC',
  ReadMoreTextDesc = 'readMoreText_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/storySection) */
export type StorySection = Entry & {
  __typename?: 'StorySection'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<StorySectionLinkingCollections>
  readMoreText?: Maybe<Scalars['String']>
  storiesCollection?: Maybe<StorySectionStoriesCollection>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/storySection) */
export type StorySectionLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/storySection) */
export type StorySectionReadMoreTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/storySection) */
export type StorySectionStoriesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/storySection) */
export type StorySectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type StorySectionCollection = {
  __typename?: 'StorySectionCollection'
  items: Array<Maybe<StorySection>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type StorySectionFilter = {
  AND?: InputMaybe<Array<InputMaybe<StorySectionFilter>>>
  OR?: InputMaybe<Array<InputMaybe<StorySectionFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  readMoreText?: InputMaybe<Scalars['String']>
  readMoreText_contains?: InputMaybe<Scalars['String']>
  readMoreText_exists?: InputMaybe<Scalars['Boolean']>
  readMoreText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  readMoreText_not?: InputMaybe<Scalars['String']>
  readMoreText_not_contains?: InputMaybe<Scalars['String']>
  readMoreText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  storiesCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type StorySectionLinkingCollections = {
  __typename?: 'StorySectionLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
}

export type StorySectionLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type StorySectionLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum StorySectionOrder {
  ReadMoreTextAsc = 'readMoreText_ASC',
  ReadMoreTextDesc = 'readMoreText_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type StorySectionStoriesCollection = {
  __typename?: 'StorySectionStoriesCollection'
  items: Array<Maybe<Story>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticle = Entry & {
  __typename?: 'SubArticle'
  content?: Maybe<SubArticleContent>
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<SubArticleLinkingCollections>
  parent?: Maybe<Article>
  showTableOfContents?: Maybe<Scalars['Boolean']>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  tilkynning?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleParentArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleShowTableOfContentsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleTilkynningArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A sub article that's a part of another main article [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subArticle) */
export type SubArticleUrlArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SubArticleCollection = {
  __typename?: 'SubArticleCollection'
  items: Array<Maybe<SubArticle>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SubArticleContent = {
  __typename?: 'SubArticleContent'
  json: Scalars['JSON']
  links: SubArticleContentLinks
}

export type SubArticleContentAssets = {
  __typename?: 'SubArticleContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type SubArticleContentEntries = {
  __typename?: 'SubArticleContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type SubArticleContentLinks = {
  __typename?: 'SubArticleContentLinks'
  assets: SubArticleContentAssets
  entries: SubArticleContentEntries
}

export type SubArticleFilter = {
  AND?: InputMaybe<Array<InputMaybe<SubArticleFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SubArticleFilter>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  parent?: InputMaybe<CfArticleNestedFilter>
  parent_exists?: InputMaybe<Scalars['Boolean']>
  showTableOfContents?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_exists?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_not?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  tilkynning?: InputMaybe<Scalars['String']>
  tilkynning_contains?: InputMaybe<Scalars['String']>
  tilkynning_exists?: InputMaybe<Scalars['Boolean']>
  tilkynning_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tilkynning_not?: InputMaybe<Scalars['String']>
  tilkynning_not_contains?: InputMaybe<Scalars['String']>
  tilkynning_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SubArticleLinkingCollections = {
  __typename?: 'SubArticleLinkingCollections'
  articleCollection?: Maybe<ArticleCollection>
  entryCollection?: Maybe<EntryCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
}

export type SubArticleLinkingCollectionsArticleCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SubArticleLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SubArticleLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SubArticleLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SubArticleLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SubArticleOrder {
  ShowTableOfContentsAsc = 'showTableOfContents_ASC',
  ShowTableOfContentsDesc = 'showTableOfContents_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeader = Entry & {
  __typename?: 'SubpageHeader'
  body?: Maybe<SubpageHeaderBody>
  contentfulMetadata: ContentfulMetadata
  featuredImage?: Maybe<Asset>
  linkedFrom?: Maybe<SubpageHeaderLinkingCollections>
  subpageId?: Maybe<Scalars['String']>
  summary?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeaderBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeaderFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeaderLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeaderSubpageIdArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeaderSummaryArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/subpageHeader) */
export type SubpageHeaderTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SubpageHeaderBody = {
  __typename?: 'SubpageHeaderBody'
  json: Scalars['JSON']
  links: SubpageHeaderBodyLinks
}

export type SubpageHeaderBodyAssets = {
  __typename?: 'SubpageHeaderBodyAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type SubpageHeaderBodyEntries = {
  __typename?: 'SubpageHeaderBodyEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type SubpageHeaderBodyLinks = {
  __typename?: 'SubpageHeaderBodyLinks'
  assets: SubpageHeaderBodyAssets
  entries: SubpageHeaderBodyEntries
}

export type SubpageHeaderCollection = {
  __typename?: 'SubpageHeaderCollection'
  items: Array<Maybe<SubpageHeader>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SubpageHeaderFilter = {
  AND?: InputMaybe<Array<InputMaybe<SubpageHeaderFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SubpageHeaderFilter>>>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  subpageId?: InputMaybe<Scalars['String']>
  subpageId_contains?: InputMaybe<Scalars['String']>
  subpageId_exists?: InputMaybe<Scalars['Boolean']>
  subpageId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subpageId_not?: InputMaybe<Scalars['String']>
  subpageId_not_contains?: InputMaybe<Scalars['String']>
  subpageId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  summary?: InputMaybe<Scalars['String']>
  summary_contains?: InputMaybe<Scalars['String']>
  summary_exists?: InputMaybe<Scalars['Boolean']>
  summary_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  summary_not?: InputMaybe<Scalars['String']>
  summary_not_contains?: InputMaybe<Scalars['String']>
  summary_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SubpageHeaderLinkingCollections = {
  __typename?: 'SubpageHeaderLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type SubpageHeaderLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SubpageHeaderOrder {
  SubpageIdAsc = 'subpageId_ASC',
  SubpageIdDesc = 'subpageId_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategory = Entry & {
  __typename?: 'SupportCategory'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  importance?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<SupportCategoryLinkingCollections>
  organization?: Maybe<Organization>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategoryDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategoryImportanceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategoryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategoryOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategorySlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Category for the helpdesk questions, used for grouping QNAs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportCategory) */
export type SupportCategoryTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SupportCategoryCollection = {
  __typename?: 'SupportCategoryCollection'
  items: Array<Maybe<SupportCategory>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SupportCategoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<SupportCategoryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SupportCategoryFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SupportCategoryLinkingCollections = {
  __typename?: 'SupportCategoryLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  supportQnaCollection?: Maybe<SupportQnaCollection>
}

export type SupportCategoryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SupportCategoryLinkingCollectionsSupportQnaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SupportCategoryOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQna = Entry & {
  __typename?: 'SupportQna'
  answer?: Maybe<SupportQnaAnswer>
  category?: Maybe<SupportCategory>
  contactLink?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  importance?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<SupportQnaLinkingCollections>
  organization?: Maybe<Organization>
  question?: Maybe<Scalars['String']>
  relatedLinksCollection?: Maybe<SupportQnaRelatedLinksCollection>
  slug?: Maybe<Scalars['String']>
  subCategory?: Maybe<SupportSubCategory>
  sys: Sys
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaAnswerArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaContactLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaImportanceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaOrganizationArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaQuestionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaRelatedLinksCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Helpdesk support questions and answer [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportQNA) */
export type SupportQnaSubCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

export type SupportQnaAnswer = {
  __typename?: 'SupportQnaAnswer'
  json: Scalars['JSON']
  links: SupportQnaAnswerLinks
}

export type SupportQnaAnswerAssets = {
  __typename?: 'SupportQnaAnswerAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type SupportQnaAnswerEntries = {
  __typename?: 'SupportQnaAnswerEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type SupportQnaAnswerLinks = {
  __typename?: 'SupportQnaAnswerLinks'
  assets: SupportQnaAnswerAssets
  entries: SupportQnaAnswerEntries
}

export type SupportQnaCollection = {
  __typename?: 'SupportQnaCollection'
  items: Array<Maybe<SupportQna>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SupportQnaFilter = {
  AND?: InputMaybe<Array<InputMaybe<SupportQnaFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SupportQnaFilter>>>
  answer_contains?: InputMaybe<Scalars['String']>
  answer_exists?: InputMaybe<Scalars['Boolean']>
  answer_not_contains?: InputMaybe<Scalars['String']>
  category?: InputMaybe<CfSupportCategoryNestedFilter>
  category_exists?: InputMaybe<Scalars['Boolean']>
  contactLink?: InputMaybe<Scalars['String']>
  contactLink_contains?: InputMaybe<Scalars['String']>
  contactLink_exists?: InputMaybe<Scalars['Boolean']>
  contactLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contactLink_not?: InputMaybe<Scalars['String']>
  contactLink_not_contains?: InputMaybe<Scalars['String']>
  contactLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  organization?: InputMaybe<CfOrganizationNestedFilter>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  question?: InputMaybe<Scalars['String']>
  question_contains?: InputMaybe<Scalars['String']>
  question_exists?: InputMaybe<Scalars['Boolean']>
  question_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  question_not?: InputMaybe<Scalars['String']>
  question_not_contains?: InputMaybe<Scalars['String']>
  question_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  relatedLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subCategory?: InputMaybe<CfSupportSubCategoryNestedFilter>
  subCategory_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type SupportQnaLinkingCollections = {
  __typename?: 'SupportQnaLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  supportQnaCollection?: Maybe<SupportQnaCollection>
}

export type SupportQnaLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SupportQnaLinkingCollectionsSupportQnaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SupportQnaOrder {
  ContactLinkAsc = 'contactLink_ASC',
  ContactLinkDesc = 'contactLink_DESC',
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  QuestionAsc = 'question_ASC',
  QuestionDesc = 'question_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type SupportQnaRelatedLinksCollection = {
  __typename?: 'SupportQnaRelatedLinksCollection'
  items: Array<Maybe<SupportQnaRelatedLinksItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SupportQnaRelatedLinksItem = Link | SupportQna

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportSubCategory) */
export type SupportSubCategory = Entry & {
  __typename?: 'SupportSubCategory'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  importance?: Maybe<Scalars['Int']>
  linkedFrom?: Maybe<SupportSubCategoryLinkingCollections>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportSubCategory) */
export type SupportSubCategoryDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportSubCategory) */
export type SupportSubCategoryImportanceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportSubCategory) */
export type SupportSubCategoryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportSubCategory) */
export type SupportSubCategorySlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/supportSubCategory) */
export type SupportSubCategoryTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type SupportSubCategoryCollection = {
  __typename?: 'SupportSubCategoryCollection'
  items: Array<Maybe<SupportSubCategory>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type SupportSubCategoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<SupportSubCategoryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<SupportSubCategoryFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type SupportSubCategoryLinkingCollections = {
  __typename?: 'SupportSubCategoryLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  supportQnaCollection?: Maybe<SupportQnaCollection>
}

export type SupportSubCategoryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type SupportSubCategoryLinkingCollectionsSupportQnaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum SupportSubCategoryOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type Sys = {
  __typename?: 'Sys'
  environmentId: Scalars['String']
  firstPublishedAt?: Maybe<Scalars['DateTime']>
  id: Scalars['String']
  publishedAt?: Maybe<Scalars['DateTime']>
  publishedVersion?: Maybe<Scalars['Int']>
  spaceId: Scalars['String']
}

export type SysFilter = {
  firstPublishedAt?: InputMaybe<Scalars['DateTime']>
  firstPublishedAt_exists?: InputMaybe<Scalars['Boolean']>
  firstPublishedAt_gt?: InputMaybe<Scalars['DateTime']>
  firstPublishedAt_gte?: InputMaybe<Scalars['DateTime']>
  firstPublishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  firstPublishedAt_lt?: InputMaybe<Scalars['DateTime']>
  firstPublishedAt_lte?: InputMaybe<Scalars['DateTime']>
  firstPublishedAt_not?: InputMaybe<Scalars['DateTime']>
  firstPublishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  id?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_exists?: InputMaybe<Scalars['Boolean']>
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  id_not?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  publishedAt_exists?: InputMaybe<Scalars['Boolean']>
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  publishedVersion?: InputMaybe<Scalars['Float']>
  publishedVersion_exists?: InputMaybe<Scalars['Boolean']>
  publishedVersion_gt?: InputMaybe<Scalars['Float']>
  publishedVersion_gte?: InputMaybe<Scalars['Float']>
  publishedVersion_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
  publishedVersion_lt?: InputMaybe<Scalars['Float']>
  publishedVersion_lte?: InputMaybe<Scalars['Float']>
  publishedVersion_not?: InputMaybe<Scalars['Float']>
  publishedVersion_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
}

/** Tab with content [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabContent) */
export type TabContent = Entry & {
  __typename?: 'TabContent'
  body?: Maybe<TabContentBody>
  contentTitle?: Maybe<Scalars['String']>
  contentfulMetadata: ContentfulMetadata
  image?: Maybe<Asset>
  linkedFrom?: Maybe<TabContentLinkingCollections>
  sys: Sys
  tabTitle?: Maybe<Scalars['String']>
}

/** Tab with content [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabContent) */
export type TabContentBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Tab with content [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabContent) */
export type TabContentContentTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Tab with content [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabContent) */
export type TabContentImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Tab with content [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabContent) */
export type TabContentLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Tab with content [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabContent) */
export type TabContentTabTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TabContentBody = {
  __typename?: 'TabContentBody'
  json: Scalars['JSON']
  links: TabContentBodyLinks
}

export type TabContentBodyAssets = {
  __typename?: 'TabContentBodyAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TabContentBodyEntries = {
  __typename?: 'TabContentBodyEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TabContentBodyLinks = {
  __typename?: 'TabContentBodyLinks'
  assets: TabContentBodyAssets
  entries: TabContentBodyEntries
}

export type TabContentCollection = {
  __typename?: 'TabContentCollection'
  items: Array<Maybe<TabContent>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TabContentFilter = {
  AND?: InputMaybe<Array<InputMaybe<TabContentFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TabContentFilter>>>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_not_contains?: InputMaybe<Scalars['String']>
  contentTitle?: InputMaybe<Scalars['String']>
  contentTitle_contains?: InputMaybe<Scalars['String']>
  contentTitle_exists?: InputMaybe<Scalars['Boolean']>
  contentTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentTitle_not?: InputMaybe<Scalars['String']>
  contentTitle_not_contains?: InputMaybe<Scalars['String']>
  contentTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  image_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  tabTitle?: InputMaybe<Scalars['String']>
  tabTitle_contains?: InputMaybe<Scalars['String']>
  tabTitle_exists?: InputMaybe<Scalars['Boolean']>
  tabTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tabTitle_not?: InputMaybe<Scalars['String']>
  tabTitle_not_contains?: InputMaybe<Scalars['String']>
  tabTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TabContentLinkingCollections = {
  __typename?: 'TabContentLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  tabSectionCollection?: Maybe<TabSectionCollection>
}

export type TabContentLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TabContentLinkingCollectionsTabSectionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TabContentOrder {
  ContentTitleAsc = 'contentTitle_ASC',
  ContentTitleDesc = 'contentTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TabTitleAsc = 'tabTitle_ASC',
  TabTitleDesc = 'tabTitle_DESC',
}

/** List of tab contents [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabSection) */
export type TabSection = Entry & {
  __typename?: 'TabSection'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<TabSectionLinkingCollections>
  sys: Sys
  tabsCollection?: Maybe<TabSectionTabsCollection>
  title?: Maybe<Scalars['String']>
}

/** List of tab contents [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabSection) */
export type TabSectionLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** List of tab contents [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabSection) */
export type TabSectionTabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** List of tab contents [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tabSection) */
export type TabSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TabSectionCollection = {
  __typename?: 'TabSectionCollection'
  items: Array<Maybe<TabSection>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TabSectionFilter = {
  AND?: InputMaybe<Array<InputMaybe<TabSectionFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TabSectionFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  tabsCollection_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TabSectionLinkingCollections = {
  __typename?: 'TabSectionLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type TabSectionLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TabSectionLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TabSectionLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TabSectionLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TabSectionLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TabSectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type TabSectionTabsCollection = {
  __typename?: 'TabSectionTabsCollection'
  items: Array<Maybe<TabContent>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tableSlice) */
export type TableSlice = Entry & {
  __typename?: 'TableSlice'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<TableSliceLinkingCollections>
  sys: Sys
  tableContent?: Maybe<TableSliceTableContent>
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tableSlice) */
export type TableSliceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tableSlice) */
export type TableSliceTableContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tableSlice) */
export type TableSliceTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TableSliceCollection = {
  __typename?: 'TableSliceCollection'
  items: Array<Maybe<TableSlice>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TableSliceFilter = {
  AND?: InputMaybe<Array<InputMaybe<TableSliceFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TableSliceFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  tableContent_contains?: InputMaybe<Scalars['String']>
  tableContent_exists?: InputMaybe<Scalars['Boolean']>
  tableContent_not_contains?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TableSliceLinkingCollections = {
  __typename?: 'TableSliceLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type TableSliceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TableSliceOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type TableSliceTableContent = {
  __typename?: 'TableSliceTableContent'
  json: Scalars['JSON']
  links: TableSliceTableContentLinks
}

export type TableSliceTableContentAssets = {
  __typename?: 'TableSliceTableContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TableSliceTableContentEntries = {
  __typename?: 'TableSliceTableContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TableSliceTableContentLinks = {
  __typename?: 'TableSliceTableContentLinks'
  assets: TableSliceTableContentAssets
  entries: TableSliceTableContentEntries
}

/** list of team members [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamList) */
export type TeamList = Entry & {
  __typename?: 'TeamList'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<TeamListLinkingCollections>
  sys: Sys
  teamMembersCollection?: Maybe<TeamListTeamMembersCollection>
}

/** list of team members [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamList) */
export type TeamListLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** list of team members [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamList) */
export type TeamListTeamMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TeamListCollection = {
  __typename?: 'TeamListCollection'
  items: Array<Maybe<TeamList>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TeamListFilter = {
  AND?: InputMaybe<Array<InputMaybe<TeamListFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TeamListFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  teamMembersCollection_exists?: InputMaybe<Scalars['Boolean']>
}

export type TeamListLinkingCollections = {
  __typename?: 'TeamListLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type TeamListLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TeamListLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TeamListLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TeamListLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TeamListOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type TeamListTeamMembersCollection = {
  __typename?: 'TeamListTeamMembersCollection'
  items: Array<Maybe<TeamMember>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamMember) */
export type TeamMember = Entry & {
  __typename?: 'TeamMember'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<TeamMemberLinkingCollections>
  mynd?: Maybe<Asset>
  name?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamMember) */
export type TeamMemberLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamMember) */
export type TeamMemberMyndArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamMember) */
export type TeamMemberNameArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/teamMember) */
export type TeamMemberTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TeamMemberCollection = {
  __typename?: 'TeamMemberCollection'
  items: Array<Maybe<TeamMember>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TeamMemberFilter = {
  AND?: InputMaybe<Array<InputMaybe<TeamMemberFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TeamMemberFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  mynd_exists?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_exists?: InputMaybe<Scalars['Boolean']>
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TeamMemberLinkingCollections = {
  __typename?: 'TeamMemberLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  teamListCollection?: Maybe<TeamListCollection>
}

export type TeamMemberLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TeamMemberLinkingCollectionsTeamListCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TeamMemberOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStory = Entry & {
  __typename?: 'TellUsAStory'
  contentfulMetadata: ContentfulMetadata
  dateOfStoryInputErrorMessage?: Maybe<Scalars['String']>
  dateOfStoryLabel?: Maybe<Scalars['String']>
  dateOfStoryPlaceholder?: Maybe<Scalars['String']>
  emailInputErrorMessage?: Maybe<Scalars['String']>
  emailLabel?: Maybe<Scalars['String']>
  emailPlaceholder?: Maybe<Scalars['String']>
  errorMessage?: Maybe<TellUsAStoryErrorMessage>
  errorMessageTitle?: Maybe<Scalars['String']>
  firstSectionTitle?: Maybe<Scalars['String']>
  instructionsDescription?: Maybe<TellUsAStoryInstructionsDescription>
  instructionsImage?: Maybe<Asset>
  instructionsTitle?: Maybe<Scalars['String']>
  introDescription?: Maybe<TellUsAStoryIntroDescription>
  introImage?: Maybe<Asset>
  introTitle?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<TellUsAStoryLinkingCollections>
  messageInputErrorMessage?: Maybe<Scalars['String']>
  messageLabel?: Maybe<Scalars['String']>
  messagePlaceholder?: Maybe<Scalars['String']>
  nameInputErrorMessage?: Maybe<Scalars['String']>
  nameLabel?: Maybe<Scalars['String']>
  namePlaceholder?: Maybe<Scalars['String']>
  organizationInputErrorMessage?: Maybe<Scalars['String']>
  organizationLabel?: Maybe<Scalars['String']>
  organizationPlaceholder?: Maybe<Scalars['String']>
  publicationAllowedLabel?: Maybe<Scalars['String']>
  secondSectionTitle?: Maybe<Scalars['String']>
  subjectInputErrorMessage?: Maybe<Scalars['String']>
  subjectLabel?: Maybe<Scalars['String']>
  subjectPlaceholder?: Maybe<Scalars['String']>
  submitButtonTitle?: Maybe<Scalars['String']>
  successMessage?: Maybe<TellUsAStorySuccessMessage>
  successMessageTitle?: Maybe<Scalars['String']>
  sys: Sys
  thirdSectionTitle?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryDateOfStoryInputErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryDateOfStoryLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryDateOfStoryPlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryEmailInputErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryEmailLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryEmailPlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryErrorMessageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryFirstSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryInstructionsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryInstructionsImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryInstructionsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryIntroDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryIntroImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryIntroTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryMessageInputErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryMessageLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryMessagePlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryNameInputErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryNameLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryNamePlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryOrganizationInputErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryOrganizationLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryOrganizationPlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryPublicationAllowedLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySecondSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySubjectInputErrorMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySubjectLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySubjectPlaceholderArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySubmitButtonTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySuccessMessageArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStorySuccessMessageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/tellUsAStory) */
export type TellUsAStoryThirdSectionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TellUsAStoryCollection = {
  __typename?: 'TellUsAStoryCollection'
  items: Array<Maybe<TellUsAStory>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TellUsAStoryErrorMessage = {
  __typename?: 'TellUsAStoryErrorMessage'
  json: Scalars['JSON']
  links: TellUsAStoryErrorMessageLinks
}

export type TellUsAStoryErrorMessageAssets = {
  __typename?: 'TellUsAStoryErrorMessageAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TellUsAStoryErrorMessageEntries = {
  __typename?: 'TellUsAStoryErrorMessageEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TellUsAStoryErrorMessageLinks = {
  __typename?: 'TellUsAStoryErrorMessageLinks'
  assets: TellUsAStoryErrorMessageAssets
  entries: TellUsAStoryErrorMessageEntries
}

export type TellUsAStoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<TellUsAStoryFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TellUsAStoryFilter>>>
  SuccessMessageTitle?: InputMaybe<Scalars['String']>
  SuccessMessageTitle_contains?: InputMaybe<Scalars['String']>
  SuccessMessageTitle_exists?: InputMaybe<Scalars['Boolean']>
  SuccessMessageTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  SuccessMessageTitle_not?: InputMaybe<Scalars['String']>
  SuccessMessageTitle_not_contains?: InputMaybe<Scalars['String']>
  SuccessMessageTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  dateOfStoryInputErrorMessage?: InputMaybe<Scalars['String']>
  dateOfStoryInputErrorMessage_contains?: InputMaybe<Scalars['String']>
  dateOfStoryInputErrorMessage_exists?: InputMaybe<Scalars['Boolean']>
  dateOfStoryInputErrorMessage_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  dateOfStoryInputErrorMessage_not?: InputMaybe<Scalars['String']>
  dateOfStoryInputErrorMessage_not_contains?: InputMaybe<Scalars['String']>
  dateOfStoryInputErrorMessage_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  dateOfStoryLabel?: InputMaybe<Scalars['String']>
  dateOfStoryLabel_contains?: InputMaybe<Scalars['String']>
  dateOfStoryLabel_exists?: InputMaybe<Scalars['Boolean']>
  dateOfStoryLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  dateOfStoryLabel_not?: InputMaybe<Scalars['String']>
  dateOfStoryLabel_not_contains?: InputMaybe<Scalars['String']>
  dateOfStoryLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  dateOfStoryPlaceholder?: InputMaybe<Scalars['String']>
  dateOfStoryPlaceholder_contains?: InputMaybe<Scalars['String']>
  dateOfStoryPlaceholder_exists?: InputMaybe<Scalars['Boolean']>
  dateOfStoryPlaceholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  dateOfStoryPlaceholder_not?: InputMaybe<Scalars['String']>
  dateOfStoryPlaceholder_not_contains?: InputMaybe<Scalars['String']>
  dateOfStoryPlaceholder_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  emailInputErrorMessage?: InputMaybe<Scalars['String']>
  emailInputErrorMessage_contains?: InputMaybe<Scalars['String']>
  emailInputErrorMessage_exists?: InputMaybe<Scalars['Boolean']>
  emailInputErrorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  emailInputErrorMessage_not?: InputMaybe<Scalars['String']>
  emailInputErrorMessage_not_contains?: InputMaybe<Scalars['String']>
  emailInputErrorMessage_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  emailLabel?: InputMaybe<Scalars['String']>
  emailLabel_contains?: InputMaybe<Scalars['String']>
  emailLabel_exists?: InputMaybe<Scalars['Boolean']>
  emailLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  emailLabel_not?: InputMaybe<Scalars['String']>
  emailLabel_not_contains?: InputMaybe<Scalars['String']>
  emailLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  emailPlaceholder?: InputMaybe<Scalars['String']>
  emailPlaceholder_contains?: InputMaybe<Scalars['String']>
  emailPlaceholder_exists?: InputMaybe<Scalars['Boolean']>
  emailPlaceholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  emailPlaceholder_not?: InputMaybe<Scalars['String']>
  emailPlaceholder_not_contains?: InputMaybe<Scalars['String']>
  emailPlaceholder_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  errorMessageTitle?: InputMaybe<Scalars['String']>
  errorMessageTitle_contains?: InputMaybe<Scalars['String']>
  errorMessageTitle_exists?: InputMaybe<Scalars['Boolean']>
  errorMessageTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  errorMessageTitle_not?: InputMaybe<Scalars['String']>
  errorMessageTitle_not_contains?: InputMaybe<Scalars['String']>
  errorMessageTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  errorMessage_contains?: InputMaybe<Scalars['String']>
  errorMessage_exists?: InputMaybe<Scalars['Boolean']>
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  firstSectionTitle?: InputMaybe<Scalars['String']>
  firstSectionTitle_contains?: InputMaybe<Scalars['String']>
  firstSectionTitle_exists?: InputMaybe<Scalars['Boolean']>
  firstSectionTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  firstSectionTitle_not?: InputMaybe<Scalars['String']>
  firstSectionTitle_not_contains?: InputMaybe<Scalars['String']>
  firstSectionTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  instructionsDescription_contains?: InputMaybe<Scalars['String']>
  instructionsDescription_exists?: InputMaybe<Scalars['Boolean']>
  instructionsDescription_not_contains?: InputMaybe<Scalars['String']>
  instructionsImage_exists?: InputMaybe<Scalars['Boolean']>
  instructionsTitle?: InputMaybe<Scalars['String']>
  instructionsTitle_contains?: InputMaybe<Scalars['String']>
  instructionsTitle_exists?: InputMaybe<Scalars['Boolean']>
  instructionsTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  instructionsTitle_not?: InputMaybe<Scalars['String']>
  instructionsTitle_not_contains?: InputMaybe<Scalars['String']>
  instructionsTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  introDescription_contains?: InputMaybe<Scalars['String']>
  introDescription_exists?: InputMaybe<Scalars['Boolean']>
  introDescription_not_contains?: InputMaybe<Scalars['String']>
  introImage_exists?: InputMaybe<Scalars['Boolean']>
  introTitle?: InputMaybe<Scalars['String']>
  introTitle_contains?: InputMaybe<Scalars['String']>
  introTitle_exists?: InputMaybe<Scalars['Boolean']>
  introTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  introTitle_not?: InputMaybe<Scalars['String']>
  introTitle_not_contains?: InputMaybe<Scalars['String']>
  introTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  messageInputErrorMessage?: InputMaybe<Scalars['String']>
  messageInputErrorMessage_contains?: InputMaybe<Scalars['String']>
  messageInputErrorMessage_exists?: InputMaybe<Scalars['Boolean']>
  messageInputErrorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  messageInputErrorMessage_not?: InputMaybe<Scalars['String']>
  messageInputErrorMessage_not_contains?: InputMaybe<Scalars['String']>
  messageInputErrorMessage_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  messageLabel?: InputMaybe<Scalars['String']>
  messageLabel_contains?: InputMaybe<Scalars['String']>
  messageLabel_exists?: InputMaybe<Scalars['Boolean']>
  messageLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  messageLabel_not?: InputMaybe<Scalars['String']>
  messageLabel_not_contains?: InputMaybe<Scalars['String']>
  messageLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  messagePlaceholder?: InputMaybe<Scalars['String']>
  messagePlaceholder_contains?: InputMaybe<Scalars['String']>
  messagePlaceholder_exists?: InputMaybe<Scalars['Boolean']>
  messagePlaceholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  messagePlaceholder_not?: InputMaybe<Scalars['String']>
  messagePlaceholder_not_contains?: InputMaybe<Scalars['String']>
  messagePlaceholder_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  nameInputErrorMessage?: InputMaybe<Scalars['String']>
  nameInputErrorMessage_contains?: InputMaybe<Scalars['String']>
  nameInputErrorMessage_exists?: InputMaybe<Scalars['Boolean']>
  nameInputErrorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  nameInputErrorMessage_not?: InputMaybe<Scalars['String']>
  nameInputErrorMessage_not_contains?: InputMaybe<Scalars['String']>
  nameInputErrorMessage_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  nameLabel?: InputMaybe<Scalars['String']>
  nameLabel_contains?: InputMaybe<Scalars['String']>
  nameLabel_exists?: InputMaybe<Scalars['Boolean']>
  nameLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  nameLabel_not?: InputMaybe<Scalars['String']>
  nameLabel_not_contains?: InputMaybe<Scalars['String']>
  nameLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  namePlaceholder?: InputMaybe<Scalars['String']>
  namePlaceholder_contains?: InputMaybe<Scalars['String']>
  namePlaceholder_exists?: InputMaybe<Scalars['Boolean']>
  namePlaceholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  namePlaceholder_not?: InputMaybe<Scalars['String']>
  namePlaceholder_not_contains?: InputMaybe<Scalars['String']>
  namePlaceholder_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organizationInputErrorMessage?: InputMaybe<Scalars['String']>
  organizationInputErrorMessage_contains?: InputMaybe<Scalars['String']>
  organizationInputErrorMessage_exists?: InputMaybe<Scalars['Boolean']>
  organizationInputErrorMessage_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  organizationInputErrorMessage_not?: InputMaybe<Scalars['String']>
  organizationInputErrorMessage_not_contains?: InputMaybe<Scalars['String']>
  organizationInputErrorMessage_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  organizationLabel?: InputMaybe<Scalars['String']>
  organizationLabel_contains?: InputMaybe<Scalars['String']>
  organizationLabel_exists?: InputMaybe<Scalars['Boolean']>
  organizationLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organizationLabel_not?: InputMaybe<Scalars['String']>
  organizationLabel_not_contains?: InputMaybe<Scalars['String']>
  organizationLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organizationPlaceholder?: InputMaybe<Scalars['String']>
  organizationPlaceholder_contains?: InputMaybe<Scalars['String']>
  organizationPlaceholder_exists?: InputMaybe<Scalars['Boolean']>
  organizationPlaceholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organizationPlaceholder_not?: InputMaybe<Scalars['String']>
  organizationPlaceholder_not_contains?: InputMaybe<Scalars['String']>
  organizationPlaceholder_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  publicationAllowedLabel?: InputMaybe<Scalars['String']>
  publicationAllowedLabel_contains?: InputMaybe<Scalars['String']>
  publicationAllowedLabel_exists?: InputMaybe<Scalars['Boolean']>
  publicationAllowedLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publicationAllowedLabel_not?: InputMaybe<Scalars['String']>
  publicationAllowedLabel_not_contains?: InputMaybe<Scalars['String']>
  publicationAllowedLabel_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  secondSectionTitle?: InputMaybe<Scalars['String']>
  secondSectionTitle_contains?: InputMaybe<Scalars['String']>
  secondSectionTitle_exists?: InputMaybe<Scalars['Boolean']>
  secondSectionTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  secondSectionTitle_not?: InputMaybe<Scalars['String']>
  secondSectionTitle_not_contains?: InputMaybe<Scalars['String']>
  secondSectionTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subjectInputErrorMessage?: InputMaybe<Scalars['String']>
  subjectInputErrorMessage_contains?: InputMaybe<Scalars['String']>
  subjectInputErrorMessage_exists?: InputMaybe<Scalars['Boolean']>
  subjectInputErrorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subjectInputErrorMessage_not?: InputMaybe<Scalars['String']>
  subjectInputErrorMessage_not_contains?: InputMaybe<Scalars['String']>
  subjectInputErrorMessage_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  subjectLabel?: InputMaybe<Scalars['String']>
  subjectLabel_contains?: InputMaybe<Scalars['String']>
  subjectLabel_exists?: InputMaybe<Scalars['Boolean']>
  subjectLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subjectLabel_not?: InputMaybe<Scalars['String']>
  subjectLabel_not_contains?: InputMaybe<Scalars['String']>
  subjectLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subjectPlaceholder?: InputMaybe<Scalars['String']>
  subjectPlaceholder_contains?: InputMaybe<Scalars['String']>
  subjectPlaceholder_exists?: InputMaybe<Scalars['Boolean']>
  subjectPlaceholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subjectPlaceholder_not?: InputMaybe<Scalars['String']>
  subjectPlaceholder_not_contains?: InputMaybe<Scalars['String']>
  subjectPlaceholder_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  submitButtonTitle?: InputMaybe<Scalars['String']>
  submitButtonTitle_contains?: InputMaybe<Scalars['String']>
  submitButtonTitle_exists?: InputMaybe<Scalars['Boolean']>
  submitButtonTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  submitButtonTitle_not?: InputMaybe<Scalars['String']>
  submitButtonTitle_not_contains?: InputMaybe<Scalars['String']>
  submitButtonTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  successMessage_contains?: InputMaybe<Scalars['String']>
  successMessage_exists?: InputMaybe<Scalars['Boolean']>
  successMessage_not_contains?: InputMaybe<Scalars['String']>
  sys?: InputMaybe<SysFilter>
  thirdSectionTitle?: InputMaybe<Scalars['String']>
  thirdSectionTitle_contains?: InputMaybe<Scalars['String']>
  thirdSectionTitle_exists?: InputMaybe<Scalars['Boolean']>
  thirdSectionTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  thirdSectionTitle_not?: InputMaybe<Scalars['String']>
  thirdSectionTitle_not_contains?: InputMaybe<Scalars['String']>
  thirdSectionTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TellUsAStoryInstructionsDescription = {
  __typename?: 'TellUsAStoryInstructionsDescription'
  json: Scalars['JSON']
  links: TellUsAStoryInstructionsDescriptionLinks
}

export type TellUsAStoryInstructionsDescriptionAssets = {
  __typename?: 'TellUsAStoryInstructionsDescriptionAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TellUsAStoryInstructionsDescriptionEntries = {
  __typename?: 'TellUsAStoryInstructionsDescriptionEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TellUsAStoryInstructionsDescriptionLinks = {
  __typename?: 'TellUsAStoryInstructionsDescriptionLinks'
  assets: TellUsAStoryInstructionsDescriptionAssets
  entries: TellUsAStoryInstructionsDescriptionEntries
}

export type TellUsAStoryIntroDescription = {
  __typename?: 'TellUsAStoryIntroDescription'
  json: Scalars['JSON']
  links: TellUsAStoryIntroDescriptionLinks
}

export type TellUsAStoryIntroDescriptionAssets = {
  __typename?: 'TellUsAStoryIntroDescriptionAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TellUsAStoryIntroDescriptionEntries = {
  __typename?: 'TellUsAStoryIntroDescriptionEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TellUsAStoryIntroDescriptionLinks = {
  __typename?: 'TellUsAStoryIntroDescriptionLinks'
  assets: TellUsAStoryIntroDescriptionAssets
  entries: TellUsAStoryIntroDescriptionEntries
}

export type TellUsAStoryLinkingCollections = {
  __typename?: 'TellUsAStoryLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type TellUsAStoryLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TellUsAStoryLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TellUsAStoryLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TellUsAStoryOrder {
  DateOfStoryInputErrorMessageAsc = 'dateOfStoryInputErrorMessage_ASC',
  DateOfStoryInputErrorMessageDesc = 'dateOfStoryInputErrorMessage_DESC',
  DateOfStoryLabelAsc = 'dateOfStoryLabel_ASC',
  DateOfStoryLabelDesc = 'dateOfStoryLabel_DESC',
  DateOfStoryPlaceholderAsc = 'dateOfStoryPlaceholder_ASC',
  DateOfStoryPlaceholderDesc = 'dateOfStoryPlaceholder_DESC',
  EmailInputErrorMessageAsc = 'emailInputErrorMessage_ASC',
  EmailInputErrorMessageDesc = 'emailInputErrorMessage_DESC',
  EmailLabelAsc = 'emailLabel_ASC',
  EmailLabelDesc = 'emailLabel_DESC',
  EmailPlaceholderAsc = 'emailPlaceholder_ASC',
  EmailPlaceholderDesc = 'emailPlaceholder_DESC',
  ErrorMessageTitleAsc = 'errorMessageTitle_ASC',
  ErrorMessageTitleDesc = 'errorMessageTitle_DESC',
  FirstSectionTitleAsc = 'firstSectionTitle_ASC',
  FirstSectionTitleDesc = 'firstSectionTitle_DESC',
  InstructionsTitleAsc = 'instructionsTitle_ASC',
  InstructionsTitleDesc = 'instructionsTitle_DESC',
  IntroTitleAsc = 'introTitle_ASC',
  IntroTitleDesc = 'introTitle_DESC',
  MessageInputErrorMessageAsc = 'messageInputErrorMessage_ASC',
  MessageInputErrorMessageDesc = 'messageInputErrorMessage_DESC',
  MessagePlaceholderAsc = 'messagePlaceholder_ASC',
  MessagePlaceholderDesc = 'messagePlaceholder_DESC',
  NameInputErrorMessageAsc = 'nameInputErrorMessage_ASC',
  NameInputErrorMessageDesc = 'nameInputErrorMessage_DESC',
  NameLabelAsc = 'nameLabel_ASC',
  NameLabelDesc = 'nameLabel_DESC',
  NamePlaceholderAsc = 'namePlaceholder_ASC',
  NamePlaceholderDesc = 'namePlaceholder_DESC',
  OrganizationInputErrorMessageAsc = 'organizationInputErrorMessage_ASC',
  OrganizationInputErrorMessageDesc = 'organizationInputErrorMessage_DESC',
  OrganizationLabelAsc = 'organizationLabel_ASC',
  OrganizationLabelDesc = 'organizationLabel_DESC',
  OrganizationPlaceholderAsc = 'organizationPlaceholder_ASC',
  OrganizationPlaceholderDesc = 'organizationPlaceholder_DESC',
  PublicationAllowedLabelAsc = 'publicationAllowedLabel_ASC',
  PublicationAllowedLabelDesc = 'publicationAllowedLabel_DESC',
  SecondSectionTitleAsc = 'secondSectionTitle_ASC',
  SecondSectionTitleDesc = 'secondSectionTitle_DESC',
  SubjectInputErrorMessageAsc = 'subjectInputErrorMessage_ASC',
  SubjectInputErrorMessageDesc = 'subjectInputErrorMessage_DESC',
  SubjectLabelAsc = 'subjectLabel_ASC',
  SubjectLabelDesc = 'subjectLabel_DESC',
  SubjectPlaceholderAsc = 'subjectPlaceholder_ASC',
  SubjectPlaceholderDesc = 'subjectPlaceholder_DESC',
  SubmitButtonTitleAsc = 'submitButtonTitle_ASC',
  SubmitButtonTitleDesc = 'submitButtonTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  ThirdSectionTitleAsc = 'thirdSectionTitle_ASC',
  ThirdSectionTitleDesc = 'thirdSectionTitle_DESC',
}

export type TellUsAStorySuccessMessage = {
  __typename?: 'TellUsAStorySuccessMessage'
  json: Scalars['JSON']
  links: TellUsAStorySuccessMessageLinks
}

export type TellUsAStorySuccessMessageAssets = {
  __typename?: 'TellUsAStorySuccessMessageAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TellUsAStorySuccessMessageEntries = {
  __typename?: 'TellUsAStorySuccessMessageEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TellUsAStorySuccessMessageLinks = {
  __typename?: 'TellUsAStorySuccessMessageLinks'
  assets: TellUsAStorySuccessMessageAssets
  entries: TellUsAStorySuccessMessageEntries
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/testHnippField) */
export type TestHnippField = Entry & {
  __typename?: 'TestHnippField'
  contentfulMetadata: ContentfulMetadata
  key?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<TestHnippFieldLinkingCollections>
  sys: Sys
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/testHnippField) */
export type TestHnippFieldKeyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/testHnippField) */
export type TestHnippFieldLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TestHnippFieldCollection = {
  __typename?: 'TestHnippFieldCollection'
  items: Array<Maybe<TestHnippField>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TestHnippFieldFilter = {
  AND?: InputMaybe<Array<InputMaybe<TestHnippFieldFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TestHnippFieldFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  key?: InputMaybe<Scalars['String']>
  key_contains?: InputMaybe<Scalars['String']>
  key_exists?: InputMaybe<Scalars['Boolean']>
  key_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  key_not?: InputMaybe<Scalars['String']>
  key_not_contains?: InputMaybe<Scalars['String']>
  key_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
}

export type TestHnippFieldLinkingCollections = {
  __typename?: 'TestHnippFieldLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type TestHnippFieldLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TestHnippFieldOrder {
  KeyAsc = 'key_ASC',
  KeyDesc = 'key_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** Timeline section with a collection of timeline events [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timeline) */
export type Timeline = Entry & {
  __typename?: 'Timeline'
  contentfulMetadata: ContentfulMetadata
  eventsCollection?: Maybe<TimelineEventsCollection>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  intro?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<TimelineLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Timeline section with a collection of timeline events [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timeline) */
export type TimelineEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Timeline section with a collection of timeline events [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timeline) */
export type TimelineHasBorderAboveArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Timeline section with a collection of timeline events [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timeline) */
export type TimelineIntroArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Timeline section with a collection of timeline events [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timeline) */
export type TimelineLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Timeline section with a collection of timeline events [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timeline) */
export type TimelineTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TimelineCollection = {
  __typename?: 'TimelineCollection'
  items: Array<Maybe<Timeline>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEvent = Entry & {
  __typename?: 'TimelineEvent'
  body?: Maybe<TimelineEventBody>
  contentfulMetadata: ContentfulMetadata
  date?: Maybe<Scalars['DateTime']>
  denominator?: Maybe<Scalars['Int']>
  label?: Maybe<Scalars['String']>
  link?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<TimelineEventLinkingCollections>
  numerator?: Maybe<Scalars['Int']>
  sys: Sys
  tags?: Maybe<Array<Maybe<Scalars['String']>>>
  title?: Maybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventBodyArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventDateArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventDenominatorArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventLabelArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventNumeratorArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventTagsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Single event on a timeline [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/timelineEvent) */
export type TimelineEventTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TimelineEventBody = {
  __typename?: 'TimelineEventBody'
  json: Scalars['JSON']
  links: TimelineEventBodyLinks
}

export type TimelineEventBodyAssets = {
  __typename?: 'TimelineEventBodyAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TimelineEventBodyEntries = {
  __typename?: 'TimelineEventBodyEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TimelineEventBodyLinks = {
  __typename?: 'TimelineEventBodyLinks'
  assets: TimelineEventBodyAssets
  entries: TimelineEventBodyEntries
}

export type TimelineEventCollection = {
  __typename?: 'TimelineEventCollection'
  items: Array<Maybe<TimelineEvent>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TimelineEventFilter = {
  AND?: InputMaybe<Array<InputMaybe<TimelineEventFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TimelineEventFilter>>>
  body_contains?: InputMaybe<Scalars['String']>
  body_exists?: InputMaybe<Scalars['Boolean']>
  body_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  date?: InputMaybe<Scalars['DateTime']>
  date_exists?: InputMaybe<Scalars['Boolean']>
  date_gt?: InputMaybe<Scalars['DateTime']>
  date_gte?: InputMaybe<Scalars['DateTime']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  date_lt?: InputMaybe<Scalars['DateTime']>
  date_lte?: InputMaybe<Scalars['DateTime']>
  date_not?: InputMaybe<Scalars['DateTime']>
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  denominator?: InputMaybe<Scalars['Int']>
  denominator_exists?: InputMaybe<Scalars['Boolean']>
  denominator_gt?: InputMaybe<Scalars['Int']>
  denominator_gte?: InputMaybe<Scalars['Int']>
  denominator_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  denominator_lt?: InputMaybe<Scalars['Int']>
  denominator_lte?: InputMaybe<Scalars['Int']>
  denominator_not?: InputMaybe<Scalars['Int']>
  denominator_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  label?: InputMaybe<Scalars['String']>
  label_contains?: InputMaybe<Scalars['String']>
  label_exists?: InputMaybe<Scalars['Boolean']>
  label_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  label_not?: InputMaybe<Scalars['String']>
  label_not_contains?: InputMaybe<Scalars['String']>
  label_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link?: InputMaybe<Scalars['String']>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  numerator?: InputMaybe<Scalars['Int']>
  numerator_exists?: InputMaybe<Scalars['Boolean']>
  numerator_gt?: InputMaybe<Scalars['Int']>
  numerator_gte?: InputMaybe<Scalars['Int']>
  numerator_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  numerator_lt?: InputMaybe<Scalars['Int']>
  numerator_lte?: InputMaybe<Scalars['Int']>
  numerator_not?: InputMaybe<Scalars['Int']>
  numerator_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  sys?: InputMaybe<SysFilter>
  tags_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tags_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tags_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tags_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TimelineEventLinkingCollections = {
  __typename?: 'TimelineEventLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  timelineCollection?: Maybe<TimelineCollection>
}

export type TimelineEventLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TimelineEventLinkingCollectionsTimelineCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TimelineEventOrder {
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  DenominatorAsc = 'denominator_ASC',
  DenominatorDesc = 'denominator_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  NumeratorAsc = 'numerator_ASC',
  NumeratorDesc = 'numerator_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type TimelineEventsCollection = {
  __typename?: 'TimelineEventsCollection'
  items: Array<Maybe<TimelineEvent>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TimelineFilter = {
  AND?: InputMaybe<Array<InputMaybe<TimelineFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TimelineFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  eventsCollection_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_exists?: InputMaybe<Scalars['Boolean']>
  hasBorderAbove_not?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TimelineLinkingCollections = {
  __typename?: 'TimelineLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  pageHeaderCollection?: Maybe<PageHeaderCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type TimelineLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TimelineLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TimelineLinkingCollectionsPageHeaderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TimelineLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TimelineOrder {
  HasBorderAboveAsc = 'hasBorderAbove_ASC',
  HasBorderAboveDesc = 'hasBorderAbove_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnText = Entry & {
  __typename?: 'TwoColumnText'
  contentfulMetadata: ContentfulMetadata
  dividerOnTop?: Maybe<Scalars['Boolean']>
  leftContent?: Maybe<TwoColumnTextLeftContent>
  leftLink?: Maybe<Link>
  leftTitle?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<TwoColumnTextLinkingCollections>
  rightContent?: Maybe<TwoColumnTextRightContent>
  rightLink?: Maybe<Link>
  rightTitle?: Maybe<Scalars['String']>
  sys: Sys
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextDividerOnTopArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextLeftContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextLeftLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextLeftTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextRightContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextRightLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/twoColumnText) */
export type TwoColumnTextRightTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type TwoColumnTextCollection = {
  __typename?: 'TwoColumnTextCollection'
  items: Array<Maybe<TwoColumnText>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type TwoColumnTextFilter = {
  AND?: InputMaybe<Array<InputMaybe<TwoColumnTextFilter>>>
  OR?: InputMaybe<Array<InputMaybe<TwoColumnTextFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  dividerOnTop?: InputMaybe<Scalars['Boolean']>
  dividerOnTop_exists?: InputMaybe<Scalars['Boolean']>
  dividerOnTop_not?: InputMaybe<Scalars['Boolean']>
  leftContent_contains?: InputMaybe<Scalars['String']>
  leftContent_exists?: InputMaybe<Scalars['Boolean']>
  leftContent_not_contains?: InputMaybe<Scalars['String']>
  leftLink?: InputMaybe<CfLinkNestedFilter>
  leftLink_exists?: InputMaybe<Scalars['Boolean']>
  leftTitle?: InputMaybe<Scalars['String']>
  leftTitle_contains?: InputMaybe<Scalars['String']>
  leftTitle_exists?: InputMaybe<Scalars['Boolean']>
  leftTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  leftTitle_not?: InputMaybe<Scalars['String']>
  leftTitle_not_contains?: InputMaybe<Scalars['String']>
  leftTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  rightContent_contains?: InputMaybe<Scalars['String']>
  rightContent_exists?: InputMaybe<Scalars['Boolean']>
  rightContent_not_contains?: InputMaybe<Scalars['String']>
  rightLink?: InputMaybe<CfLinkNestedFilter>
  rightLink_exists?: InputMaybe<Scalars['Boolean']>
  rightTitle?: InputMaybe<Scalars['String']>
  rightTitle_contains?: InputMaybe<Scalars['String']>
  rightTitle_exists?: InputMaybe<Scalars['Boolean']>
  rightTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  rightTitle_not?: InputMaybe<Scalars['String']>
  rightTitle_not_contains?: InputMaybe<Scalars['String']>
  rightTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
}

export type TwoColumnTextLeftContent = {
  __typename?: 'TwoColumnTextLeftContent'
  json: Scalars['JSON']
  links: TwoColumnTextLeftContentLinks
}

export type TwoColumnTextLeftContentAssets = {
  __typename?: 'TwoColumnTextLeftContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TwoColumnTextLeftContentEntries = {
  __typename?: 'TwoColumnTextLeftContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TwoColumnTextLeftContentLinks = {
  __typename?: 'TwoColumnTextLeftContentLinks'
  assets: TwoColumnTextLeftContentAssets
  entries: TwoColumnTextLeftContentEntries
}

export type TwoColumnTextLinkingCollections = {
  __typename?: 'TwoColumnTextLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  organizationPageCollection?: Maybe<OrganizationPageCollection>
  organizationSubpageCollection?: Maybe<OrganizationSubpageCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
  projectSubpageCollection?: Maybe<ProjectSubpageCollection>
}

export type TwoColumnTextLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TwoColumnTextLinkingCollectionsOrganizationPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TwoColumnTextLinkingCollectionsOrganizationSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TwoColumnTextLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type TwoColumnTextLinkingCollectionsProjectSubpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum TwoColumnTextOrder {
  DividerOnTopAsc = 'dividerOnTop_ASC',
  DividerOnTopDesc = 'dividerOnTop_DESC',
  LeftTitleAsc = 'leftTitle_ASC',
  LeftTitleDesc = 'leftTitle_DESC',
  RightTitleAsc = 'rightTitle_ASC',
  RightTitleDesc = 'rightTitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type TwoColumnTextRightContent = {
  __typename?: 'TwoColumnTextRightContent'
  json: Scalars['JSON']
  links: TwoColumnTextRightContentLinks
}

export type TwoColumnTextRightContentAssets = {
  __typename?: 'TwoColumnTextRightContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type TwoColumnTextRightContentEntries = {
  __typename?: 'TwoColumnTextRightContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type TwoColumnTextRightContentLinks = {
  __typename?: 'TwoColumnTextRightContentLinks'
  assets: TwoColumnTextRightContentAssets
  entries: TwoColumnTextRightContentEntries
}

/** Each entry is a namespace that contains key->value pairs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/uiConfiguration) */
export type UiConfiguration = Entry & {
  __typename?: 'UiConfiguration'
  contentfulMetadata: ContentfulMetadata
  fields?: Maybe<Scalars['JSON']>
  linkedFrom?: Maybe<UiConfigurationLinkingCollections>
  namespace?: Maybe<Scalars['String']>
  sys: Sys
}

/** Each entry is a namespace that contains key->value pairs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/uiConfiguration) */
export type UiConfigurationFieldsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Each entry is a namespace that contains key->value pairs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/uiConfiguration) */
export type UiConfigurationLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Each entry is a namespace that contains key->value pairs [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/uiConfiguration) */
export type UiConfigurationNamespaceArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type UiConfigurationCollection = {
  __typename?: 'UiConfigurationCollection'
  items: Array<Maybe<UiConfiguration>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type UiConfigurationFilter = {
  AND?: InputMaybe<Array<InputMaybe<UiConfigurationFilter>>>
  OR?: InputMaybe<Array<InputMaybe<UiConfigurationFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  fields_exists?: InputMaybe<Scalars['Boolean']>
  namespace?: InputMaybe<Scalars['String']>
  namespace_contains?: InputMaybe<Scalars['String']>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  namespace_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  namespace_not?: InputMaybe<Scalars['String']>
  namespace_not_contains?: InputMaybe<Scalars['String']>
  namespace_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
}

export type UiConfigurationLinkingCollections = {
  __typename?: 'UiConfigurationLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  frontpageCollection?: Maybe<FrontpageCollection>
  organizationCollection?: Maybe<OrganizationCollection>
  projectPageCollection?: Maybe<ProjectPageCollection>
}

export type UiConfigurationLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type UiConfigurationLinkingCollectionsFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type UiConfigurationLinkingCollectionsOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type UiConfigurationLinkingCollectionsProjectPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum UiConfigurationOrder {
  NamespaceAsc = 'namespace_ASC',
  NamespaceDesc = 'namespace_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/url) */
export type Url = Entry & {
  __typename?: 'Url'
  contentfulMetadata: ContentfulMetadata
  explicitRedirect?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<UrlLinkingCollections>
  page?: Maybe<UrlPage>
  sys: Sys
  title?: Maybe<Scalars['String']>
  urlsList?: Maybe<Array<Maybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/url) */
export type UrlExplicitRedirectArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/url) */
export type UrlLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/url) */
export type UrlPageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/url) */
export type UrlTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/url) */
export type UrlUrlsListArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type UrlCollection = {
  __typename?: 'UrlCollection'
  items: Array<Maybe<Url>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type UrlFilter = {
  AND?: InputMaybe<Array<InputMaybe<UrlFilter>>>
  OR?: InputMaybe<Array<InputMaybe<UrlFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  explicitRedirect?: InputMaybe<Scalars['String']>
  explicitRedirect_contains?: InputMaybe<Scalars['String']>
  explicitRedirect_exists?: InputMaybe<Scalars['Boolean']>
  explicitRedirect_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  explicitRedirect_not?: InputMaybe<Scalars['String']>
  explicitRedirect_not_contains?: InputMaybe<Scalars['String']>
  explicitRedirect_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  page_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  urlsList_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  urlsList_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  urlsList_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  urlsList_exists?: InputMaybe<Scalars['Boolean']>
}

export type UrlLinkingCollections = {
  __typename?: 'UrlLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
}

export type UrlLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum UrlOrder {
  ExplicitRedirectAsc = 'explicitRedirect_ASC',
  ExplicitRedirectDesc = 'explicitRedirect_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type UrlPage =
  | Article
  | ArticleCategory
  | LifeEventPage
  | News
  | ProjectPage
  | VidspyrnaFrontpage
  | VidspyrnaPage

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFeaturedNews) */
export type VidspyrnaFeaturedNews = Entry & {
  __typename?: 'VidspyrnaFeaturedNews'
  contentfulMetadata: ContentfulMetadata
  featuredCollection?: Maybe<VidspyrnaFeaturedNewsFeaturedCollection>
  linkedFrom?: Maybe<VidspyrnaFeaturedNewsLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFeaturedNews) */
export type VidspyrnaFeaturedNewsFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFeaturedNews) */
export type VidspyrnaFeaturedNewsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFeaturedNews) */
export type VidspyrnaFeaturedNewsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type VidspyrnaFeaturedNewsCollection = {
  __typename?: 'VidspyrnaFeaturedNewsCollection'
  items: Array<Maybe<VidspyrnaFeaturedNews>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaFeaturedNewsFeaturedCollection = {
  __typename?: 'VidspyrnaFeaturedNewsFeaturedCollection'
  items: Array<Maybe<News>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaFeaturedNewsFilter = {
  AND?: InputMaybe<Array<InputMaybe<VidspyrnaFeaturedNewsFilter>>>
  OR?: InputMaybe<Array<InputMaybe<VidspyrnaFeaturedNewsFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  featuredCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type VidspyrnaFeaturedNewsLinkingCollections = {
  __typename?: 'VidspyrnaFeaturedNewsLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
}

export type VidspyrnaFeaturedNewsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFeaturedNewsLinkingCollectionsVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum VidspyrnaFeaturedNewsOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkur = Entry & {
  __typename?: 'VidspyrnaFlokkur'
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  image?: Maybe<Asset>
  linkedFrom?: Maybe<VidspyrnaFlokkurLinkingCollections>
  pagesCollection?: Maybe<VidspyrnaFlokkurPagesCollection>
  subtitle?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkurDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkurImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkurLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkurPagesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkurSubtitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A group of "covid" articles shown in a slider. [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaFlokkur) */
export type VidspyrnaFlokkurTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type VidspyrnaFlokkurCollection = {
  __typename?: 'VidspyrnaFlokkurCollection'
  items: Array<Maybe<VidspyrnaFlokkur>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaFlokkurFilter = {
  AND?: InputMaybe<Array<InputMaybe<VidspyrnaFlokkurFilter>>>
  OR?: InputMaybe<Array<InputMaybe<VidspyrnaFlokkurFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  image_exists?: InputMaybe<Scalars['Boolean']>
  pagesCollection_exists?: InputMaybe<Scalars['Boolean']>
  subtitle?: InputMaybe<Scalars['String']>
  subtitle_contains?: InputMaybe<Scalars['String']>
  subtitle_exists?: InputMaybe<Scalars['Boolean']>
  subtitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  subtitle_not?: InputMaybe<Scalars['String']>
  subtitle_not_contains?: InputMaybe<Scalars['String']>
  subtitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type VidspyrnaFlokkurLinkingCollections = {
  __typename?: 'VidspyrnaFlokkurLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  vidspyrnaFrontpageCollection?: Maybe<VidspyrnaFrontpageCollection>
}

export type VidspyrnaFlokkurLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFlokkurLinkingCollectionsVidspyrnaFrontpageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum VidspyrnaFlokkurOrder {
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type VidspyrnaFlokkurPagesCollection = {
  __typename?: 'VidspyrnaFlokkurPagesCollection'
  items: Array<Maybe<VidspyrnaPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpage = Entry & {
  __typename?: 'VidspyrnaFrontpage'
  category?: Maybe<ArticleCategory>
  content?: Maybe<VidspyrnaFrontpageContent>
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  featuredImage?: Maybe<Asset>
  group?: Maybe<ArticleGroup>
  linkedFrom?: Maybe<VidspyrnaFrontpageLinkingCollections>
  organizationCollection?: Maybe<VidspyrnaFrontpageOrganizationCollection>
  slicesCollection?: Maybe<VidspyrnaFrontpageSlicesCollection>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageFeaturedImageArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageGroupArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageOrganizationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageSlicesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** Frontpage of /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrna-frontpage) */
export type VidspyrnaFrontpageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type VidspyrnaFrontpageCollection = {
  __typename?: 'VidspyrnaFrontpageCollection'
  items: Array<Maybe<VidspyrnaFrontpage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaFrontpageContent = {
  __typename?: 'VidspyrnaFrontpageContent'
  json: Scalars['JSON']
  links: VidspyrnaFrontpageContentLinks
}

export type VidspyrnaFrontpageContentAssets = {
  __typename?: 'VidspyrnaFrontpageContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type VidspyrnaFrontpageContentEntries = {
  __typename?: 'VidspyrnaFrontpageContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type VidspyrnaFrontpageContentLinks = {
  __typename?: 'VidspyrnaFrontpageContentLinks'
  assets: VidspyrnaFrontpageContentAssets
  entries: VidspyrnaFrontpageContentEntries
}

export type VidspyrnaFrontpageFilter = {
  AND?: InputMaybe<Array<InputMaybe<VidspyrnaFrontpageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<VidspyrnaFrontpageFilter>>>
  category?: InputMaybe<CfArticleCategoryNestedFilter>
  category_exists?: InputMaybe<Scalars['Boolean']>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  group?: InputMaybe<CfArticleGroupNestedFilter>
  group_exists?: InputMaybe<Scalars['Boolean']>
  organizationCollection_exists?: InputMaybe<Scalars['Boolean']>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type VidspyrnaFrontpageLinkingCollections = {
  __typename?: 'VidspyrnaFrontpageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  featuredCollection?: Maybe<FeaturedCollection>
  frontpageSliderCollection?: Maybe<FrontpageSliderCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  urlCollection?: Maybe<UrlCollection>
}

export type VidspyrnaFrontpageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFrontpageLinkingCollectionsFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFrontpageLinkingCollectionsFrontpageSliderCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFrontpageLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFrontpageLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFrontpageLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaFrontpageLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum VidspyrnaFrontpageOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type VidspyrnaFrontpageOrganizationCollection = {
  __typename?: 'VidspyrnaFrontpageOrganizationCollection'
  items: Array<Maybe<Organization>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaFrontpageSlicesCollection = {
  __typename?: 'VidspyrnaFrontpageSlicesCollection'
  items: Array<Maybe<VidspyrnaFrontpageSlicesItem>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaFrontpageSlicesItem =
  | VidspyrnaFeaturedNews
  | VidspyrnaFlokkur

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPage = Entry & {
  __typename?: 'VidspyrnaPage'
  content?: Maybe<VidspyrnaPageContent>
  contentfulMetadata: ContentfulMetadata
  description?: Maybe<Scalars['String']>
  link?: Maybe<Scalars['String']>
  linkButtonText?: Maybe<Scalars['String']>
  linkedFrom?: Maybe<VidspyrnaPageLinkingCollections>
  longDescription?: Maybe<Scalars['String']>
  processEntry?: Maybe<ProcessEntry>
  slug?: Maybe<Scalars['String']>
  sys: Sys
  tagsCollection?: Maybe<VidspyrnaPageTagsCollection>
  title?: Maybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageContentArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageLinkArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageLinkButtonTextArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageLongDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageProcessEntryArgs = {
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageSlugArgs = {
  locale?: InputMaybe<Scalars['String']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

/** A "covid" article, seen on /covid-adgerdir [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaPage) */
export type VidspyrnaPageTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type VidspyrnaPageCollection = {
  __typename?: 'VidspyrnaPageCollection'
  items: Array<Maybe<VidspyrnaPage>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaPageContent = {
  __typename?: 'VidspyrnaPageContent'
  json: Scalars['JSON']
  links: VidspyrnaPageContentLinks
}

export type VidspyrnaPageContentAssets = {
  __typename?: 'VidspyrnaPageContentAssets'
  block: Array<Maybe<Asset>>
  hyperlink: Array<Maybe<Asset>>
}

export type VidspyrnaPageContentEntries = {
  __typename?: 'VidspyrnaPageContentEntries'
  block: Array<Maybe<Entry>>
  hyperlink: Array<Maybe<Entry>>
  inline: Array<Maybe<Entry>>
}

export type VidspyrnaPageContentLinks = {
  __typename?: 'VidspyrnaPageContentLinks'
  assets: VidspyrnaPageContentAssets
  entries: VidspyrnaPageContentEntries
}

export type VidspyrnaPageFilter = {
  AND?: InputMaybe<Array<InputMaybe<VidspyrnaPageFilter>>>
  OR?: InputMaybe<Array<InputMaybe<VidspyrnaPageFilter>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link?: InputMaybe<Scalars['String']>
  linkButtonText?: InputMaybe<Scalars['String']>
  linkButtonText_contains?: InputMaybe<Scalars['String']>
  linkButtonText_exists?: InputMaybe<Scalars['Boolean']>
  linkButtonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkButtonText_not?: InputMaybe<Scalars['String']>
  linkButtonText_not_contains?: InputMaybe<Scalars['String']>
  linkButtonText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  longDescription?: InputMaybe<Scalars['String']>
  longDescription_contains?: InputMaybe<Scalars['String']>
  longDescription_exists?: InputMaybe<Scalars['Boolean']>
  longDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  longDescription_not?: InputMaybe<Scalars['String']>
  longDescription_not_contains?: InputMaybe<Scalars['String']>
  longDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processEntry?: InputMaybe<CfProcessEntryNestedFilter>
  processEntry_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type VidspyrnaPageLinkingCollections = {
  __typename?: 'VidspyrnaPageLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  featuredCollection?: Maybe<FeaturedCollection>
  introLinkImageCollection?: Maybe<IntroLinkImageCollection>
  menuLinkCollection?: Maybe<MenuLinkCollection>
  menuLinkWithChildrenCollection?: Maybe<MenuLinkWithChildrenCollection>
  urlCollection?: Maybe<UrlCollection>
  vidspyrnaFlokkurCollection?: Maybe<VidspyrnaFlokkurCollection>
}

export type VidspyrnaPageLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaPageLinkingCollectionsFeaturedCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaPageLinkingCollectionsIntroLinkImageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaPageLinkingCollectionsMenuLinkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaPageLinkingCollectionsMenuLinkWithChildrenCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaPageLinkingCollectionsUrlCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaPageLinkingCollectionsVidspyrnaFlokkurCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum VidspyrnaPageOrder {
  LinkButtonTextAsc = 'linkButtonText_ASC',
  LinkButtonTextDesc = 'linkButtonText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type VidspyrnaPageTagsCollection = {
  __typename?: 'VidspyrnaPageTagsCollection'
  items: Array<Maybe<VidspyrnaTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

/** A tag used to tag "covid" articles [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaTag) */
export type VidspyrnaTag = Entry & {
  __typename?: 'VidspyrnaTag'
  contentfulMetadata: ContentfulMetadata
  linkedFrom?: Maybe<VidspyrnaTagLinkingCollections>
  sys: Sys
  title?: Maybe<Scalars['String']>
}

/** A tag used to tag "covid" articles [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaTag) */
export type VidspyrnaTagLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** A tag used to tag "covid" articles [See type definition](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types/vidspyrnaTag) */
export type VidspyrnaTagTitleArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type VidspyrnaTagCollection = {
  __typename?: 'VidspyrnaTagCollection'
  items: Array<Maybe<VidspyrnaTag>>
  limit: Scalars['Int']
  skip: Scalars['Int']
  total: Scalars['Int']
}

export type VidspyrnaTagFilter = {
  AND?: InputMaybe<Array<InputMaybe<VidspyrnaTagFilter>>>
  OR?: InputMaybe<Array<InputMaybe<VidspyrnaTagFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type VidspyrnaTagLinkingCollections = {
  __typename?: 'VidspyrnaTagLinkingCollections'
  entryCollection?: Maybe<EntryCollection>
  vidspyrnaPageCollection?: Maybe<VidspyrnaPageCollection>
}

export type VidspyrnaTagLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export type VidspyrnaTagLinkingCollectionsVidspyrnaPageCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>
  locale?: InputMaybe<Scalars['String']>
  preview?: InputMaybe<Scalars['Boolean']>
  skip?: InputMaybe<Scalars['Int']>
}

export enum VidspyrnaTagOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type CfAlertBannerNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfAlertBannerNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfAlertBannerNestedFilter>>>
  bannerVariant?: InputMaybe<Scalars['String']>
  bannerVariant_contains?: InputMaybe<Scalars['String']>
  bannerVariant_exists?: InputMaybe<Scalars['Boolean']>
  bannerVariant_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  bannerVariant_not?: InputMaybe<Scalars['String']>
  bannerVariant_not_contains?: InputMaybe<Scalars['String']>
  bannerVariant_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  dismissedForDays?: InputMaybe<Scalars['Int']>
  dismissedForDays_exists?: InputMaybe<Scalars['Boolean']>
  dismissedForDays_gt?: InputMaybe<Scalars['Int']>
  dismissedForDays_gte?: InputMaybe<Scalars['Int']>
  dismissedForDays_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  dismissedForDays_lt?: InputMaybe<Scalars['Int']>
  dismissedForDays_lte?: InputMaybe<Scalars['Int']>
  dismissedForDays_not?: InputMaybe<Scalars['Int']>
  dismissedForDays_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  isDismissable?: InputMaybe<Scalars['Boolean']>
  isDismissable_exists?: InputMaybe<Scalars['Boolean']>
  isDismissable_not?: InputMaybe<Scalars['Boolean']>
  linkTitle?: InputMaybe<Scalars['String']>
  linkTitle_contains?: InputMaybe<Scalars['String']>
  linkTitle_exists?: InputMaybe<Scalars['Boolean']>
  linkTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  linkTitle_not?: InputMaybe<Scalars['String']>
  linkTitle_not_contains?: InputMaybe<Scalars['String']>
  linkTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_exists?: InputMaybe<Scalars['Boolean']>
  servicePortalPaths_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  servicePortalPaths_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  servicePortalPaths_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  servicePortalPaths_exists?: InputMaybe<Scalars['Boolean']>
  showAlertBanner?: InputMaybe<Scalars['Boolean']>
  showAlertBanner_exists?: InputMaybe<Scalars['Boolean']>
  showAlertBanner_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfArticleCategoryNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfArticleCategoryNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfArticleCategoryNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfArticleGroupNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfArticleGroupNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfArticleGroupNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfArticleNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfArticleNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfArticleNestedFilter>>>
  alertBanner_exists?: InputMaybe<Scalars['Boolean']>
  category_exists?: InputMaybe<Scalars['Boolean']>
  contentStatus?: InputMaybe<Scalars['String']>
  contentStatus_contains?: InputMaybe<Scalars['String']>
  contentStatus_exists?: InputMaybe<Scalars['Boolean']>
  contentStatus_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentStatus_not?: InputMaybe<Scalars['String']>
  contentStatus_not_contains?: InputMaybe<Scalars['String']>
  contentStatus_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  content_contains?: InputMaybe<Scalars['String']>
  content_exists?: InputMaybe<Scalars['Boolean']>
  content_not_contains?: InputMaybe<Scalars['String']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  group_exists?: InputMaybe<Scalars['Boolean']>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organizationCollection_exists?: InputMaybe<Scalars['Boolean']>
  otherCategoriesCollection_exists?: InputMaybe<Scalars['Boolean']>
  otherGroupsCollection_exists?: InputMaybe<Scalars['Boolean']>
  otherSubgroupsCollection_exists?: InputMaybe<Scalars['Boolean']>
  processEntryButtonText?: InputMaybe<Scalars['String']>
  processEntryButtonText_contains?: InputMaybe<Scalars['String']>
  processEntryButtonText_exists?: InputMaybe<Scalars['Boolean']>
  processEntryButtonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processEntryButtonText_not?: InputMaybe<Scalars['String']>
  processEntryButtonText_not_contains?: InputMaybe<Scalars['String']>
  processEntryButtonText_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >
  processEntry_exists?: InputMaybe<Scalars['Boolean']>
  relatedArticlesCollection_exists?: InputMaybe<Scalars['Boolean']>
  relatedContentCollection_exists?: InputMaybe<Scalars['Boolean']>
  relatedOrganizationCollection_exists?: InputMaybe<Scalars['Boolean']>
  responsiblePartyCollection_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle?: InputMaybe<Scalars['String']>
  shortTitle_contains?: InputMaybe<Scalars['String']>
  shortTitle_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle_not?: InputMaybe<Scalars['String']>
  shortTitle_not_contains?: InputMaybe<Scalars['String']>
  shortTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  showTableOfContents?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_exists?: InputMaybe<Scalars['Boolean']>
  showTableOfContents_not?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  stepper_exists?: InputMaybe<Scalars['Boolean']>
  subArticlesCollection_exists?: InputMaybe<Scalars['Boolean']>
  subgroup_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  userStories_contains?: InputMaybe<Scalars['String']>
  userStories_exists?: InputMaybe<Scalars['Boolean']>
  userStories_not_contains?: InputMaybe<Scalars['String']>
}

export type CfArticleSubgroupNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfArticleSubgroupNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfArticleSubgroupNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfCardSectionNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfCardSectionNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfCardSectionNestedFilter>>>
  cardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfFormFieldNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfFormFieldNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfFormFieldNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  emailConfig_exists?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_exists?: InputMaybe<Scalars['Boolean']>
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  options_exists?: InputMaybe<Scalars['Boolean']>
  placeholder?: InputMaybe<Scalars['String']>
  placeholder_contains?: InputMaybe<Scalars['String']>
  placeholder_exists?: InputMaybe<Scalars['Boolean']>
  placeholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  placeholder_not?: InputMaybe<Scalars['String']>
  placeholder_not_contains?: InputMaybe<Scalars['String']>
  placeholder_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  required?: InputMaybe<Scalars['Boolean']>
  required_exists?: InputMaybe<Scalars['Boolean']>
  required_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfGenericTagGroupNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfGenericTagGroupNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfGenericTagGroupNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfGenericTagNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfGenericTagNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfGenericTagNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  genericTagGroup_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfGraphCardNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfGraphCardNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfGraphCardNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  data_exists?: InputMaybe<Scalars['Boolean']>
  datakeys_exists?: InputMaybe<Scalars['Boolean']>
  displayAsCard?: InputMaybe<Scalars['Boolean']>
  displayAsCard_exists?: InputMaybe<Scalars['Boolean']>
  displayAsCard_not?: InputMaybe<Scalars['Boolean']>
  graphDescription?: InputMaybe<Scalars['String']>
  graphDescription_contains?: InputMaybe<Scalars['String']>
  graphDescription_exists?: InputMaybe<Scalars['Boolean']>
  graphDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphDescription_not?: InputMaybe<Scalars['String']>
  graphDescription_not_contains?: InputMaybe<Scalars['String']>
  graphDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphTitle?: InputMaybe<Scalars['String']>
  graphTitle_contains?: InputMaybe<Scalars['String']>
  graphTitle_exists?: InputMaybe<Scalars['Boolean']>
  graphTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  graphTitle_not?: InputMaybe<Scalars['String']>
  graphTitle_not_contains?: InputMaybe<Scalars['String']>
  graphTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organization?: InputMaybe<Scalars['String']>
  organizationLogo_exists?: InputMaybe<Scalars['Boolean']>
  organization_contains?: InputMaybe<Scalars['String']>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  organization_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  organization_not?: InputMaybe<Scalars['String']>
  organization_not_contains?: InputMaybe<Scalars['String']>
  organization_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfLinkGroupNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLinkGroupNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfLinkGroupNestedFilter>>>
  childrenLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_exists?: InputMaybe<Scalars['Boolean']>
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  primaryLink_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
}

export type CfLinkListNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLinkListNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfLinkListNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfLinkNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLinkNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfLinkNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  date?: InputMaybe<Scalars['DateTime']>
  date_exists?: InputMaybe<Scalars['Boolean']>
  date_gt?: InputMaybe<Scalars['DateTime']>
  date_gte?: InputMaybe<Scalars['DateTime']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  date_lt?: InputMaybe<Scalars['DateTime']>
  date_lte?: InputMaybe<Scalars['DateTime']>
  date_not?: InputMaybe<Scalars['DateTime']>
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  labels_exists?: InputMaybe<Scalars['Boolean']>
  linkReference_exists?: InputMaybe<Scalars['Boolean']>
  searchable?: InputMaybe<Scalars['Boolean']>
  searchable_exists?: InputMaybe<Scalars['Boolean']>
  searchable_not?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  text?: InputMaybe<Scalars['String']>
  text_contains?: InputMaybe<Scalars['String']>
  text_exists?: InputMaybe<Scalars['Boolean']>
  text_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  text_not?: InputMaybe<Scalars['String']>
  text_not_contains?: InputMaybe<Scalars['String']>
  text_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfLinkUrlNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLinkUrlNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfLinkUrlNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  sys?: InputMaybe<SysFilter>
  url?: InputMaybe<Scalars['String']>
  url_contains?: InputMaybe<Scalars['String']>
  url_exists?: InputMaybe<Scalars['Boolean']>
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  url_not?: InputMaybe<Scalars['String']>
  url_not_contains?: InputMaybe<Scalars['String']>
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfLinkedPageNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLinkedPageNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfLinkedPageNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  page_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfMenuNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfMenuNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfMenuNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  linksCollection_exists?: InputMaybe<Scalars['Boolean']>
  menuLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfOrganizationNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfOrganizationNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfOrganizationNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  email?: InputMaybe<Scalars['String']>
  email_contains?: InputMaybe<Scalars['String']>
  email_exists?: InputMaybe<Scalars['Boolean']>
  email_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  email_not?: InputMaybe<Scalars['String']>
  email_not_contains?: InputMaybe<Scalars['String']>
  email_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  footerItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  hasALandingPage?: InputMaybe<Scalars['Boolean']>
  hasALandingPage_exists?: InputMaybe<Scalars['Boolean']>
  hasALandingPage_not?: InputMaybe<Scalars['Boolean']>
  link?: InputMaybe<Scalars['String']>
  link_contains?: InputMaybe<Scalars['String']>
  link_exists?: InputMaybe<Scalars['Boolean']>
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  link_not?: InputMaybe<Scalars['String']>
  link_not_contains?: InputMaybe<Scalars['String']>
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  logo_exists?: InputMaybe<Scalars['Boolean']>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  phone?: InputMaybe<Scalars['String']>
  phone_contains?: InputMaybe<Scalars['String']>
  phone_exists?: InputMaybe<Scalars['Boolean']>
  phone_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  phone_not?: InputMaybe<Scalars['String']>
  phone_not_contains?: InputMaybe<Scalars['String']>
  phone_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publishedMaterialSearchFilterGenericTagsCollection_exists?: InputMaybe<
    Scalars['Boolean']
  >
  serviceWebEnabled?: InputMaybe<Scalars['Boolean']>
  serviceWebEnabled_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebEnabled_not?: InputMaybe<Scalars['Boolean']>
  serviceWebFeaturedImage_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebPopularQuestionCount?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebPopularQuestionCount_gt?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_gte?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_in?: InputMaybe<
    Array<InputMaybe<Scalars['Int']>>
  >
  serviceWebPopularQuestionCount_lt?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_lte?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_not?: InputMaybe<Scalars['Int']>
  serviceWebPopularQuestionCount_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['Int']>>
  >
  serviceWebTitle?: InputMaybe<Scalars['String']>
  serviceWebTitle_contains?: InputMaybe<Scalars['String']>
  serviceWebTitle_exists?: InputMaybe<Scalars['Boolean']>
  serviceWebTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  serviceWebTitle_not?: InputMaybe<Scalars['String']>
  serviceWebTitle_not_contains?: InputMaybe<Scalars['String']>
  serviceWebTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle?: InputMaybe<Scalars['String']>
  shortTitle_contains?: InputMaybe<Scalars['String']>
  shortTitle_exists?: InputMaybe<Scalars['Boolean']>
  shortTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  shortTitle_not?: InputMaybe<Scalars['String']>
  shortTitle_not_contains?: InputMaybe<Scalars['String']>
  shortTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  showsUpOnTheOrganizationsPage?: InputMaybe<Scalars['Boolean']>
  showsUpOnTheOrganizationsPage_exists?: InputMaybe<Scalars['Boolean']>
  showsUpOnTheOrganizationsPage_not?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  tagCollection_exists?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfOrganizationPageNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfOrganizationPageNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfOrganizationPageNestedFilter>>>
  alertBanner_exists?: InputMaybe<Scalars['Boolean']>
  bottomSlicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  defaultHeaderImage_exists?: InputMaybe<Scalars['Boolean']>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  externalLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  featuredImage_exists?: InputMaybe<Scalars['Boolean']>
  footerItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  intro?: InputMaybe<Scalars['String']>
  intro_contains?: InputMaybe<Scalars['String']>
  intro_exists?: InputMaybe<Scalars['Boolean']>
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  intro_not?: InputMaybe<Scalars['String']>
  intro_not_contains?: InputMaybe<Scalars['String']>
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  menuItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  menuLinksCollection_exists?: InputMaybe<Scalars['Boolean']>
  newsTag_exists?: InputMaybe<Scalars['Boolean']>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  secondaryMenuItemsCollection_exists?: InputMaybe<Scalars['Boolean']>
  secondaryMenu_exists?: InputMaybe<Scalars['Boolean']>
  sidebarCardsCollection_exists?: InputMaybe<Scalars['Boolean']>
  slicesCollection_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  theme?: InputMaybe<Scalars['String']>
  themeProperties_exists?: InputMaybe<Scalars['Boolean']>
  theme_contains?: InputMaybe<Scalars['String']>
  theme_exists?: InputMaybe<Scalars['Boolean']>
  theme_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  theme_not?: InputMaybe<Scalars['String']>
  theme_not_contains?: InputMaybe<Scalars['String']>
  theme_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tilkynning?: InputMaybe<Scalars['String']>
  tilkynning_contains?: InputMaybe<Scalars['String']>
  tilkynning_exists?: InputMaybe<Scalars['Boolean']>
  tilkynning_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  tilkynning_not?: InputMaybe<Scalars['String']>
  tilkynning_not_contains?: InputMaybe<Scalars['String']>
  tilkynning_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfProcessEntryNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfProcessEntryNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfProcessEntryNestedFilter>>>
  buttonText?: InputMaybe<Scalars['String']>
  buttonText_contains?: InputMaybe<Scalars['String']>
  buttonText_exists?: InputMaybe<Scalars['Boolean']>
  buttonText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  buttonText_not?: InputMaybe<Scalars['String']>
  buttonText_not_contains?: InputMaybe<Scalars['String']>
  buttonText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  openLinkInModal?: InputMaybe<Scalars['Boolean']>
  openLinkInModal_exists?: InputMaybe<Scalars['Boolean']>
  openLinkInModal_not?: InputMaybe<Scalars['Boolean']>
  processAsset_exists?: InputMaybe<Scalars['Boolean']>
  processLink?: InputMaybe<Scalars['String']>
  processLink_contains?: InputMaybe<Scalars['String']>
  processLink_exists?: InputMaybe<Scalars['Boolean']>
  processLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processLink_not?: InputMaybe<Scalars['String']>
  processLink_not_contains?: InputMaybe<Scalars['String']>
  processLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processTitle?: InputMaybe<Scalars['String']>
  processTitle_contains?: InputMaybe<Scalars['String']>
  processTitle_exists?: InputMaybe<Scalars['Boolean']>
  processTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  processTitle_not?: InputMaybe<Scalars['String']>
  processTitle_not_contains?: InputMaybe<Scalars['String']>
  processTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  type?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_exists?: InputMaybe<Scalars['Boolean']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type_not?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfStepperNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfStepperNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfStepperNestedFilter>>>
  config_exists?: InputMaybe<Scalars['Boolean']>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  stepsCollection_exists?: InputMaybe<Scalars['Boolean']>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfSupportCategoryNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfSupportCategoryNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfSupportCategoryNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  organization_exists?: InputMaybe<Scalars['Boolean']>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfSupportSubCategoryNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfSupportSubCategoryNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfSupportSubCategoryNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  description?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_exists?: InputMaybe<Scalars['Boolean']>
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  description_not?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  importance?: InputMaybe<Scalars['Int']>
  importance_exists?: InputMaybe<Scalars['Boolean']>
  importance_gt?: InputMaybe<Scalars['Int']>
  importance_gte?: InputMaybe<Scalars['Int']>
  importance_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  importance_lt?: InputMaybe<Scalars['Int']>
  importance_lte?: InputMaybe<Scalars['Int']>
  importance_not?: InputMaybe<Scalars['Int']>
  importance_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  slug?: InputMaybe<Scalars['String']>
  slug_contains?: InputMaybe<Scalars['String']>
  slug_exists?: InputMaybe<Scalars['Boolean']>
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  slug_not?: InputMaybe<Scalars['String']>
  slug_not_contains?: InputMaybe<Scalars['String']>
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
  title?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_exists?: InputMaybe<Scalars['Boolean']>
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  title_not?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type CfUiConfigurationNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfUiConfigurationNestedFilter>>>
  OR?: InputMaybe<Array<InputMaybe<CfUiConfigurationNestedFilter>>>
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>
  fields_exists?: InputMaybe<Scalars['Boolean']>
  namespace?: InputMaybe<Scalars['String']>
  namespace_contains?: InputMaybe<Scalars['String']>
  namespace_exists?: InputMaybe<Scalars['Boolean']>
  namespace_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  namespace_not?: InputMaybe<Scalars['String']>
  namespace_not_contains?: InputMaybe<Scalars['String']>
  namespace_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  sys?: InputMaybe<SysFilter>
}

export type GetTemplatesQueryVariables = Exact<{
  locale: Scalars['String']
}>

export type GetTemplatesQuery = {
  __typename?: 'Query'
  hnippTemplateCollection?: {
    __typename?: 'HnippTemplateCollection'
    items: Array<{
      __typename?: 'HnippTemplate'
      templateId?: string | null
      notificationTitle?: string | null
      notificationBody?: string | null
      notificationDataCopy?: string | null
      clickAction?: string | null
      category?: string | null
      args?: Array<string | null> | null
    } | null>
  } | null
}

export const GetTemplatesDocument = gql`
  query getTemplates($locale: String!) {
    hnippTemplateCollection(locale: $locale) {
      items {
        templateId
        notificationTitle
        notificationBody
        notificationDataCopy
        clickAction
        category
        args
      }
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    getTemplates(
      variables: GetTemplatesQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetTemplatesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetTemplatesQuery>(GetTemplatesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getTemplates',
        'query',
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
