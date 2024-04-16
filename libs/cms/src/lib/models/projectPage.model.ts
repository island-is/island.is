import { Field, ObjectType, ID } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'
import { getProjectPageUrlPrefix } from '@island.is/shared/utils'

import { ILinkFields, IProjectPage } from '../generated/contentfulTypes'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { mapProjectSubpage, ProjectSubpage } from './projectSubpage.model'
import { mapStepper, Stepper } from './stepper.model'
import { mapImage, Image } from './image.model'
import { ILinkGroupModel, LinkGroup, mapLinkGroup } from './linkGroup.model'
import { FooterItem, mapFooterItem } from './footerItem.model'
import { Link, mapLink } from './link.model'
import { mapNamespace, Namespace } from './namespace.model'
import {
  mapOrganizationTheme,
  OrganizationTheme,
} from './organizationTheme.model'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'

@ObjectType()
class ProjectPageThemeProperties extends OrganizationTheme {}

const mapProjectPageThemeProperties = (
  fields: IProjectPage['fields'],
): ProjectPageThemeProperties =>
  mapOrganizationTheme(fields.themeProperties ?? {})

@ObjectType()
export class ProjectPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  theme!: string

  @Field()
  sidebar!: boolean

  @CacheField(() => [LinkGroup])
  sidebarLinks!: Array<LinkGroup>

  @CacheField(() => LinkGroup, { nullable: true })
  secondarySidebar?: LinkGroup | null

  @Field()
  subtitle!: string

  @Field()
  intro!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @CacheField(() => Stepper, { nullable: true })
  stepper!: Stepper | null

  @CacheField(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>

  @CacheField(() => [SliceUnion])
  bottomSlices!: Array<typeof SliceUnion | null>

  @CacheField(() => GenericTag, { nullable: true })
  newsTag!: GenericTag | null

  @CacheField(() => [ProjectSubpage])
  projectSubpages!: Array<ProjectSubpage>

  @CacheField(() => Image, { nullable: true })
  featuredImage!: Image | null

  @CacheField(() => Image, { nullable: true })
  defaultHeaderImage!: Image | null

  @Field()
  defaultHeaderBackgroundColor!: string

  @CacheField(() => ProjectPageThemeProperties, { nullable: true })
  themeProperties?: ProjectPageThemeProperties

  @Field()
  featuredDescription!: string

  @CacheField(() => GraphQLJSON, { nullable: true })
  footerConfig?: { background?: string; textColor?: string } | null

  @CacheField(() => [FooterItem], { nullable: true })
  footerItems?: FooterItem[]

  @CacheField(() => Link, { nullable: true })
  backLink?: Link | null

  @Field(() => Boolean, { nullable: true })
  contentIsFullWidth?: boolean

  @CacheField(() => Namespace, { nullable: true })
  namespace?: Namespace | null

  @CacheField(() => AlertBanner, { nullable: true })
  alertBanner?: AlertBanner
}

const processSidebarLinks = (projectPage: IProjectPage) => {
  let hasFrontpageLink = false

  const filteredItems: ILinkGroupModel[] = (
    projectPage.fields.sidebarLinks ?? []
  ).filter((linkGroup) => {
    const linkGroupContentTypeId =
      linkGroup?.fields?.primaryLink?.sys?.contentType?.sys?.id

    if (!linkGroupContentTypeId) {
      return false
    }

    if (
      projectPage.fields.sidebarFrontpageLink &&
      linkGroupContentTypeId === 'link'
    ) {
      const linkFields = linkGroup.fields.primaryLink.fields as ILinkFields

      const frontpageLinkIsPresent =
        linkFields.url.split('/').at(-1) === projectPage.fields.slug

      if (frontpageLinkIsPresent) {
        hasFrontpageLink = true
      }
    }

    if (linkGroupContentTypeId === 'link') {
      return true
    }

    // Filter out links that are not present in the projectSubpages array (since those links will result in a 404)
    return (
      linkGroupContentTypeId === 'projectSubpage' &&
      projectPage.fields.projectSubpages?.some((subpage) => {
        return subpage.sys.id === linkGroup.fields.primaryLink?.sys.id
      })
    )
  })

  // Create a frontpage link at the top of the sidebar if it's been requested and isn't already there
  if (projectPage.fields.sidebarFrontpageLink && !hasFrontpageLink) {
    const frontpageText =
      projectPage.sys.locale === 'is-IS' ? 'Forsíða' : 'Frontpage'

    const frontpageUrlWithPrefix = `/${getProjectPageUrlPrefix(
      projectPage.sys.locale,
    )}/${projectPage.fields.slug}`

    filteredItems.unshift({
      sys: {
        ...projectPage.sys,
        contentType: {
          sys: {
            id: 'linkGroup',
            linkType: 'ContentType',
            type: 'Link',
          },
        },
      },
      fields: {
        name: frontpageText,
        childrenLinks: [],
        primaryLink: {
          ...projectPage,
          sys: {
            ...projectPage.sys,
            contentType: {
              sys: {
                id: 'link',
                linkType: 'ContentType',
                type: 'Link',
              },
            },
          },
          fields: { text: frontpageText, url: frontpageUrlWithPrefix },
        },
      },
    })
  }

  for (const item of filteredItems) {
    item.fields.childrenLinks =
      item.fields.childrenLinks?.filter((childLink) => {
        const childLinkContentTypeId = childLink?.sys?.contentType?.sys?.id
        if (!childLinkContentTypeId) {
          return false
        }

        if (childLinkContentTypeId === 'link') {
          return true
        }
        return (
          childLinkContentTypeId === 'projectSubpage' &&
          projectPage.fields.projectSubpages?.some(
            (subpage) => subpage.sys.id === childLink.sys.id,
          )
        )
      }) ?? []
  }

  return filteredItems
}

export const mapProjectPage = (projectPage: IProjectPage): ProjectPage => {
  const { sys, fields } = projectPage

  return {
    id: sys.id,
    title: fields.title ?? '',
    slug: (fields.slug ?? '').trim(),
    theme: fields.theme ?? 'default',
    sidebar: fields.sidebar ?? false,
    sidebarLinks: processSidebarLinks(projectPage)
      .map((linkGroup) =>
        mapLinkGroup({ ...linkGroup, pageAbove: projectPage }),
      )
      .filter((link) => Boolean(link.primaryLink)),
    secondarySidebar: fields.secondarySidebar
      ? mapLinkGroup(fields.secondarySidebar)
      : null,
    subtitle: fields.subtitle ?? '',
    intro: fields.intro ?? '',
    content: fields.content
      ? mapDocument(fields.content, sys.id + ':content')
      : [],
    stepper: fields.stepper ? mapStepper(fields.stepper) : null,
    slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
    bottomSlices: (fields.bottomSlices ?? [])
      .map(safelyMapSliceUnion)
      .filter(Boolean),
    newsTag: fields.newsTag ? mapGenericTag(fields.newsTag) : null,
    projectSubpages: (fields.projectSubpages ?? [])
      .filter((p) => p.fields?.title)
      .map(mapProjectSubpage),
    featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
    defaultHeaderImage: fields.defaultHeaderImage
      ? mapImage(fields.defaultHeaderImage)
      : null,
    defaultHeaderBackgroundColor: fields.defaultHeaderBackgroundColor ?? '',
    featuredDescription: fields.featuredDescription ?? '',
    footerItems: fields.footerItems
      ? fields.footerItems.map(mapFooterItem)
      : [],
    footerConfig: fields.footerConfig,
    backLink: fields.backLink ? mapLink(fields.backLink) : null,
    contentIsFullWidth: fields.contentIsFullWidth ?? false,
    namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
    themeProperties: mapProjectPageThemeProperties(fields),
    alertBanner: fields.alertBanner
      ? mapAlertBanner(fields.alertBanner)
      : undefined,
  }
}
