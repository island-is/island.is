import { Field, ObjectType, ID } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'
import { IOrganization } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'
import { FooterItem, mapFooterItem } from './footerItem.model'
import { mapNamespace, Namespace } from './namespace.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { EmailSignup, mapEmailSignup } from './emailSignup.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  shortTitle?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string

  @CacheField(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @CacheField(() => Image, { nullable: true })
  logo?: Image | null

  @Field({ nullable: true })
  link?: string

  @CacheField(() => GraphQLJSON, { nullable: true })
  footerConfig?: { background?: string; textColor?: string } | null

  @CacheField(() => [FooterItem])
  footerItems?: Array<FooterItem>

  @Field()
  phone?: string

  @Field()
  email?: string

  @Field(() => String, { nullable: true })
  serviceWebTitle?: string | null

  @Field(() => Boolean, { nullable: true })
  serviceWebEnabled?: boolean

  @Field(() => Number, { nullable: true })
  serviceWebPopularQuestionCount?: number

  @CacheField(() => Namespace, { nullable: true })
  namespace!: Namespace | null

  @CacheField(() => Image, { nullable: true })
  serviceWebFeaturedImage!: Image | null

  @CacheField(() => [GenericTag])
  publishedMaterialSearchFilterGenericTags!: GenericTag[]

  @Field(() => Boolean, { nullable: true })
  showsUpOnTheOrganizationsPage?: boolean

  @Field(() => Boolean, { nullable: true })
  hasALandingPage?: boolean

  @Field({ nullable: true })
  trackingDomain?: string

  @Field({ nullable: true })
  referenceIdentifier?: string

  @CacheField(() => [EmailSignup], { nullable: true })
  newsBottomSlices?: Array<EmailSignup>

  @Field(() => Boolean, { nullable: true })
  canPagesBeFoundInSearchResults?: boolean
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => {
  return {
    id: sys.id,
    title: fields.title?.trim() ?? '',
    shortTitle: fields.shortTitle ?? '',
    description: fields.description ?? '',
    slug: fields.slug?.trim() ?? '',
    tag: (fields.tag ?? []).map(mapOrganizationTag),
    logo: fields.logo ? mapImage(fields.logo) : null,
    link: fields.link ?? '',
    footerConfig: fields.footerConfig,
    footerItems: (fields.footerItems ?? []).map(mapFooterItem),
    phone: fields.phone ?? '',
    email: fields.email ?? '',
    serviceWebTitle: fields.serviceWebTitle ?? '',
    serviceWebEnabled: Boolean(fields.serviceWebEnabled),
    serviceWebPopularQuestionCount: fields.serviceWebPopularQuestionCount ?? 0,
    namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
    serviceWebFeaturedImage: fields.serviceWebFeaturedImage
      ? mapImage(fields.serviceWebFeaturedImage)
      : null,
    publishedMaterialSearchFilterGenericTags:
      fields.publishedMaterialSearchFilterGenericTags
        ? fields.publishedMaterialSearchFilterGenericTags.map(mapGenericTag)
        : [],
    showsUpOnTheOrganizationsPage: fields.showsUpOnTheOrganizationsPage ?? true,
    hasALandingPage: fields.hasALandingPage ?? true,
    trackingDomain: fields.trackingDomain ?? '',
    referenceIdentifier: fields.referenceIdentifier,
    newsBottomSlices: (fields.newsBottomSlices ?? []).map(mapEmailSignup),
    canPagesBeFoundInSearchResults:
      fields.canPagesBeFoundInSearchResults ?? true,
  }
}
