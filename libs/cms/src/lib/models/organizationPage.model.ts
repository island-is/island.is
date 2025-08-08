import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SitemapTree, SitemapTreeNodeType } from '@island.is/shared/types'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'

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
import { resolveSitemapNodeUrl } from './utils'

@ObjectType()
class OrganizationPageTopLevelNavigationLink {
  @Field()
  label!: string

  @Field()
  href!: string

  @Field(() => String, { nullable: true })
  entryId?: string
}

@ObjectType()
export class OrganizationPageTopLevelNavigation {
  @CacheField(() => [OrganizationPageTopLevelNavigationLink])
  links!: OrganizationPageTopLevelNavigationLink[]
}

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

  @CacheField(() => OrganizationPageTopLevelNavigation, { nullable: true })
  topLevelNavigation?: OrganizationPageTopLevelNavigation | null

  @Field(() => Boolean, { nullable: true })
  canBeFoundInSearchResults?: boolean

  @Field(() => Boolean, { nullable: true })
  showPastEventsOption?: boolean

  @Field(() => String, { nullable: true })
  lang?: string
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => {
  const organizationPageSlug = (
    (fields.slug || fields.organization?.fields?.slug) ??
    ''
  ).trim()
  const topLevelNavigation: OrganizationPageTopLevelNavigation = { links: [] }
  const englishLocale = sys.locale === 'en'

  // Extract top level navigation from sitemap tree
  for (const node of (fields.sitemap?.fields?.tree as SitemapTree)
    ?.childNodes ?? []) {
    if (node.type === SitemapTreeNodeType.URL) {
      topLevelNavigation.links.push({
        label: sys.locale === 'en' ? node.labelEN ?? '' : node.label ?? '',
        href: resolveSitemapNodeUrl(node, organizationPageSlug, sys.locale),
      })
      continue
    }

    if (node.type === SitemapTreeNodeType.ENTRY) {
      topLevelNavigation.links.push({
        label: '',
        href: '',
        entryId: node.entryId,
      })
      continue
    }

    if (!englishLocale && Boolean(node.label) && Boolean(node.slug)) {
      topLevelNavigation.links.push({
        label: node.label,
        href: `/${getOrganizationPageUrlPrefix(
          sys.locale,
        )}/${organizationPageSlug}/${node.slug}`,
      })
    } else if (englishLocale && Boolean(node.labelEN) && Boolean(node.slugEN)) {
      topLevelNavigation.links.push({
        label: node.labelEN as string,
        href: `/${getOrganizationPageUrlPrefix(
          sys.locale,
        )}/${organizationPageSlug}/${node.slugEN}`,
      })
    }
  }

  return {
    id: sys.id,
    title: fields.title ?? '',
    slug: organizationPageSlug,
    description: fields.description ?? '',
    theme: fields.theme ?? 'default',
    themeProperties: mapOrganizationTheme(fields.themeProperties ?? {}),
    slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
    bottomSlices: (fields.bottomSlices ?? [])
      .map(safelyMapSliceUnion)
      .filter(Boolean),
    secondaryNewsTags: (fields.secondaryNewsTags ?? []).map(mapGenericTag),
    menuLinks: (fields.menuLinks ?? [])
      .map(mapLinkGroup)
      .filter((linkGroup) => Boolean(linkGroup?.primaryLink)),
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
    topLevelNavigation,
    canBeFoundInSearchResults: fields.canBeFoundInSearchResults ?? true,
    showPastEventsOption: fields.showPastEventsOption ?? false,
    lang: sys.locale,
  }
}
