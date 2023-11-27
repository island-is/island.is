import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IOrganizationPage } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'
import { LinkGroup, mapLinkGroup } from './linkGroup.model'
import { Link, mapLink } from './link.model'
import { Image, mapImage } from './image.model'
import { safelyMapSliceUnion, SliceUnion } from '../unions/slice.union'
import {
  mapOrganizationTheme,
  OrganizationTheme,
} from './organizationTheme.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'

@ObjectType()
export class OrganizationPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  description!: string

  @Field()
  theme!: string

  @Field()
  themeProperties!: OrganizationTheme

  @CacheField(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>

  @CacheField(() => [SliceUnion])
  bottomSlices!: Array<typeof SliceUnion | null>

  @CacheField(() => [GenericTag], { nullable: true })
  secondaryNewsTags?: GenericTag[] | null

  @CacheField(() => [LinkGroup])
  menuLinks!: Array<LinkGroup>

  @CacheField(() => LinkGroup, { nullable: true })
  secondaryMenu!: LinkGroup | null

  @CacheField(() => Organization, { nullable: true })
  organization!: Organization | null

  @CacheField(() => Image, { nullable: true })
  featuredImage!: Image | null

  @CacheField(() => [SliceUnion], { nullable: true })
  sidebarCards?: Array<typeof SliceUnion | null>

  @CacheField(() => [Link], { nullable: true })
  externalLinks?: Array<Link>

  @CacheField(() => AlertBanner, { nullable: true })
  alertBanner?: AlertBanner

  @CacheField(() => Image, { nullable: true })
  defaultHeaderImage?: Image
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  description: fields.description ?? '',
  theme: fields.theme ?? 'default',
  themeProperties: mapOrganizationTheme(fields.themeProperties ?? {}),
  slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
  bottomSlices: (fields.bottomSlices ?? [])
    .map(safelyMapSliceUnion)
    .filter(Boolean),
  secondaryNewsTags: (fields.secondaryNewsTags ?? []).map(mapGenericTag),
  menuLinks: (fields.menuLinks ?? []).map(mapLinkGroup),
  secondaryMenu: fields.secondaryMenu
    ? mapLinkGroup(fields.secondaryMenu)
    : null,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  sidebarCards: (fields.sidebarCards ?? [])
    .map(safelyMapSliceUnion)
    .filter(Boolean),
  externalLinks: (fields.externalLinks ?? []).map(mapLink),
  alertBanner: fields.alertBanner
    ? mapAlertBanner(fields.alertBanner)
    : undefined,
  defaultHeaderImage: fields.defaultHeaderImage
    ? mapImage(fields.defaultHeaderImage)
    : undefined,
})
