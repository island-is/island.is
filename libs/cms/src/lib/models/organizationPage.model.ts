import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheControl, CacheField } from '@island.is/nest/graphql'
import { type SitemapTree, SitemapTreeNodeType } from '@island.is/shared/types'
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

@ObjectType()
class OrganizationPageTopLevelNavigationLink {
  @Field()
  label!: string

  @Field()
  href!: string
}

@ObjectType()
class OrganizationPageTopLevelNavigation {
  @CacheField(() => [OrganizationPageTopLevelNavigationLink])
  links!: OrganizationPageTopLevelNavigationLink[]
}

@ObjectType('OrganizationPageBottomLink')
export class BottomLink {
  @Field(() => String)
  label!: string

  @Field(() => String)
  href!: string
}

@ObjectType('OrganizationPageMidLink')
export class MidLink {
  @Field(() => String)
  label!: string

  @Field(() => String)
  href!: string

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}

@ObjectType('OrganizationPageTopLink')
export class TopLink {
  @Field(() => String)
  label!: string

  @Field(() => String)
  href!: string

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean

  @CacheField(() => [MidLink])
  midLinks!: MidLink[]
}

@ObjectType('OrganizationPageNavigationLinksCategoryLink')
export class NavigationLinksCategoryLink {
  @Field(() => String)
  label!: string

  @Field(() => String)
  href!: string

  @Field(() => String, { nullable: true })
  description?: string
}

@ObjectType('OrganizationPageNavigationLinksCategory')
export class NavigationLinksCategory {
  @Field(() => String)
  label!: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  icelandicSlug?: string

  @Field(() => String, { nullable: true })
  englishSlug?: string

  @CacheField(() => [NavigationLinksCategoryLink])
  childLinks!: NavigationLinksCategoryLink[]
}

@ObjectType('OrganizationPageNavigationLinks')
export class NavigationLinks {
  @CacheField(() => [TopLink])
  topLinks!: TopLink[]

  @CacheField(() => [BottomLink])
  breadcrumbs!: BottomLink[]

  @CacheField(() => NavigationLinksCategory, { nullable: true })
  activeCategory?: NavigationLinksCategory | null
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

  @CacheControl({ inheritMaxAge: true })
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

  @CacheField(() => NavigationLinks, { nullable: true })
  navigationLinks?: SitemapTree

  @Field(() => Boolean, { nullable: true })
  canBeFoundInSearchResults?: boolean

  @Field(() => Boolean, { nullable: true })
  showPastEventsOption?: boolean

  @CacheField(() => [String], { nullable: true })
  subpageSlugsInput?: string[]

  @Field(() => String, { nullable: true })
  lang?: string
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => {
  const slug = ((fields.slug || fields.organization?.fields?.slug) ?? '').trim()

  const topLevelNavigation: OrganizationPageTopLevelNavigation = { links: [] }

  const sitemapTree = fields.sitemap?.fields.tree as SitemapTree | undefined

  // Extract top level navigation from sitemap tree
  for (const node of sitemapTree?.childNodes ?? []) {
    if (
      node.type === SitemapTreeNodeType.CATEGORY &&
      Boolean(node.label) &&
      Boolean(node.slug)
    ) {
      topLevelNavigation.links.push({
        label: node.label,
        href: `/${getOrganizationPageUrlPrefix(sys.locale)}/${slug}/${
          node.slug
        }`,
      })
    }
  }

  return {
    id: sys.id,
    title: fields.title ?? '',
    slug,
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
    navigationLinks: sitemapTree,
    lang: sys.locale,
  }
}
