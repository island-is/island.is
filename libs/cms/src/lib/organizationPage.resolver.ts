import type { Entry } from 'contentful'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { CmsContentfulService } from './cms.contentful.service'
import {
  NavigationLinks,
  OrganizationPage,
  TopLink,
  MidLink,
  BottomLink,
  NavigationLinksCategory,
  NavigationLinksCategoryLink,
} from './models/organizationPage.model'
import { SitemapTreeNode, SitemapTreeNodeType } from '@island.is/shared/types'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'
import {
  IOrganizationParentSubpage,
  IOrganizationSubpage,
} from './generated/contentfulTypes'
import { generateOrganizationSubpageLink } from './models/linkGroup.model'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

type Breadcrumb =
  | BottomLink & { description?: string } & (
        | {
            isCategory: true
            icelandicSlug?: string
            englishSlug?: string
            childLinks: NavigationLinksCategoryLink[]
          }
        | { isCategory: false }
      )

@Resolver(() => OrganizationPage)
@CacheControl(defaultCache)
export class OrganizationPageResolver {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  private getNodeSlug(
    node: SitemapTreeNode,
    lang: string,
    entryMap: Map<string, { link: BottomLink; entry: Entry<unknown> }>,
  ) {
    if (node.type === SitemapTreeNodeType.ENTRY && Boolean(node.entryId)) {
      const entryItem = entryMap.get(node.entryId)
      if (!entryItem) return ''
      const entryFields = entryItem.entry.fields as { slug?: string }
      return entryFields?.slug ?? ''
    }
    if (node.type === SitemapTreeNodeType.CATEGORY) {
      return lang === 'en' ? node.slugEN : node.slug
    }
    return ''
  }

  private findNodeWithSlug(
    root: { childNodes: SitemapTreeNode[] },
    slug: string,
    lang: string,
    entryMap: Map<string, { link: BottomLink; entry: Entry<unknown> }>,
  ): { nodeTrail: SitemapTreeNode[]; node: SitemapTreeNode | null } {
    for (const node of root?.childNodes ?? []) {
      if (this.getNodeSlug(node, lang, entryMap) === slug)
        return { nodeTrail: [], node }
      if (node.type === SitemapTreeNodeType.CATEGORY) {
        for (const child of node?.childNodes ?? []) {
          if (this.getNodeSlug(child, lang, entryMap) === slug)
            return { nodeTrail: [node], node: child }
          if (child.type === SitemapTreeNodeType.CATEGORY) {
            for (const grandchild of child?.childNodes ?? []) {
              if (this.getNodeSlug(grandchild, lang, entryMap) === slug)
                return { nodeTrail: [node, child], node: grandchild }
            }
          }
        }
      }
    }

    return {
      nodeTrail: [],
      node: null,
    }
  }

  private convertNodeToBreadcrumb(
    node: SitemapTreeNode,
    lang: string,
    organizationPage: OrganizationPage,
    entryMap: Map<string, { link: BottomLink; entry: Entry<unknown> }>,
  ): Breadcrumb | undefined | null {
    if (node.type === SitemapTreeNodeType.ENTRY) {
      const entryItem = entryMap.get(node.entryId)
      if (!entryItem) return null
      return {
        ...entryItem.link,
        isCategory: false,
        description: (entryItem.entry.fields as { shortDescription?: string })
          ?.shortDescription,
      }
    }
    if (node.type === SitemapTreeNodeType.CATEGORY) {
      const nodeSlug = lang === 'en' ? node.slugEN : node.slug
      const nodeLabel = lang === 'en' ? node.labelEN : node.label
      if (!nodeSlug || !nodeLabel) return null
      return {
        label: nodeLabel,
        href: `/${getOrganizationPageUrlPrefix(lang)}/${
          organizationPage.slug
        }/${nodeSlug}`,
        isCategory: true,
        description: lang === 'en' ? node.descriptionEN : node.description,
        icelandicSlug: node.slug,
        englishSlug: node.slugEN,
        childLinks: node.childNodes
          .map((childNode) =>
            this.convertNodeToBreadcrumb(
              childNode,
              lang,
              organizationPage,
              entryMap,
            ),
          )
          .filter(Boolean) as NavigationLinksCategoryLink[],
      }
    }
  }

  private getBreadcrumbs(
    organizationPage: OrganizationPage,
    entryMap: Map<string, { link: BottomLink; entry: Entry<unknown> }>,
    lang: string,
  ) {
    const slugs = organizationPage.subpageSlugsInput ?? []
    const breadcrumbs: Breadcrumb[] = []
    const activeNodeIds = new Set<number>()

    if (slugs.length > 0) {
      breadcrumbs.push({
        label: 'Ísland.is',
        href: lang === 'en' ? '/en' : '/',
        isCategory: false,
      })
      breadcrumbs.push({
        label: organizationPage.title,
        href: `/${getOrganizationPageUrlPrefix(lang)}/${organizationPage.slug}`,
        isCategory: false,
      })
    }

    let category = organizationPage.navigationLinks

    if (!category) {
      return { breadcrumbs, activeNodeIds }
    }

    for (const slug of slugs) {
      const { node, nodeTrail } = this.findNodeWithSlug(
        category,
        slug,
        lang,
        entryMap,
      )
      if (!node) break
      for (const trail of nodeTrail) {
        const item = this.convertNodeToBreadcrumb(
          trail,
          lang,
          organizationPage,
          entryMap,
        )
        if (!item) break
        activeNodeIds.add(trail.id)
        breadcrumbs.push(item)
      }
      const item = this.convertNodeToBreadcrumb(
        node,
        lang,
        organizationPage,
        entryMap,
      )
      if (!item) break
      activeNodeIds.add(node.id)
      breadcrumbs.push(item)
      category = node
    }

    return { breadcrumbs, activeNodeIds }
  }

  private extractNavigationLinkEntryIds(organizationPage: OrganizationPage) {
    const parentSubpageEntryIds = new Set<string>()
    const organizationSubpageEntryIds = new Set<string>()
    const entryIds = new Set<string>()

    const assignEntryToSet = (node: SitemapTreeNode) => {
      if (!(node.type === SitemapTreeNodeType.ENTRY && Boolean(node.entryId)))
        return
      if (node.contentType === 'organizationParentSubpage')
        parentSubpageEntryIds.add(node.entryId)
      else if (node.contentType === 'organizationSubpage')
        organizationSubpageEntryIds.add(node.entryId)
      else entryIds.add(node.entryId)
    }

    for (const node of organizationPage.navigationLinks?.childNodes ?? []) {
      if (node.type === SitemapTreeNodeType.ENTRY && Boolean(node.entryId)) {
        assignEntryToSet(node)
        continue
      }
      if (node.type === SitemapTreeNodeType.CATEGORY)
        for (const child of node.childNodes) {
          if (
            child.type === SitemapTreeNodeType.ENTRY &&
            Boolean(child.entryId)
          ) {
            assignEntryToSet(child)
            continue
          }
          if (child.type === SitemapTreeNodeType.CATEGORY)
            for (const grandchild of child.childNodes)
              if (
                grandchild.type === SitemapTreeNodeType.ENTRY &&
                Boolean(grandchild.entryId)
              ) {
                assignEntryToSet(grandchild)
                continue
              }
        }
    }

    return {
      parentSubpageEntryIds: Array.from(parentSubpageEntryIds),
      organizationSubpageEntryIds: Array.from(organizationSubpageEntryIds),
      entryIds: Array.from(entryIds),
    }
  }

  private getNodeLabelAndHref(
    node: SitemapTreeNode,
    lang: string,
    organizationPage: OrganizationPage,
    entryMap: Map<string, { link: BottomLink; entry: Entry<unknown> }>,
  ) {
    if (node.type === SitemapTreeNodeType.CATEGORY) {
      const nodeSlug = lang === 'en' ? node.slugEN : node.slug
      const nodeLabel = lang === 'en' ? node.labelEN : node.label
      if (!nodeSlug || !nodeLabel)
        return {
          label: '',
          href: '',
        }
      return {
        label: nodeLabel,
        href: `/${getOrganizationPageUrlPrefix(lang)}/${
          organizationPage.slug
        }/${nodeSlug}`,
      }
    }
    if (node.type === SitemapTreeNodeType.URL) {
      const baseUrl = `/${getOrganizationPageUrlPrefix(lang)}/${
        organizationPage.slug
      }`
      switch (node.urlType) {
        case 'organizationFrontpage':
          return {
            label: lang === 'en' ? node.labelEN : node.label,
            href: baseUrl,
          }
        case 'organizationNewsOverview':
          return {
            label: lang === 'en' ? node.labelEN : node.label,
            href: `${baseUrl}/${lang === 'en' ? 'news' : 'frett'}`,
          }
        case 'organizationPublishedMaterial':
          return {
            label: lang === 'en' ? node.labelEN : node.label,
            href: `${baseUrl}/${
              lang === 'en' ? 'published-material' : 'utgefid-efni'
            }`,
          }
        case 'organizationEventOverview':
          return {
            label: lang === 'en' ? node.labelEN : node.label,
            href: `${baseUrl}/${lang === 'en' ? 'events' : 'vidburdir'}`,
          }
        default:
          return {
            label: lang === 'en' ? node.labelEN : node.label,
            href: lang === 'en' ? node.urlEN : node.url,
          }
      }
    }
    if (node.type === SitemapTreeNodeType.ENTRY) {
      const entryItem = entryMap.get(node.entryId)
      if (!entryItem)
        return {
          label: '',
          href: '',
        }
      return {
        label: entryItem.link.label,
        href: entryItem.link.href,
      }
    }
    return {
      label: '',
      href: '',
    }
  }

  private getTopLinks(
    organizationPage: OrganizationPage,
    entryMap: Map<string, { link: BottomLink; entry: Entry<unknown> }>,
    lang: string,
    activeNodeIds: Set<number>,
  ): TopLink[] {
    return (
      organizationPage.navigationLinks?.childNodes?.map((node) => {
        const { label, href } = this.getNodeLabelAndHref(
          node,
          lang,
          organizationPage,
          entryMap,
        )
        if (!label || !href) return null
        return {
          label,
          href,
          isActive: activeNodeIds.has(node.id),
          midLinks: node.childNodes
            .map((childNode) => {
              const { label, href } = this.getNodeLabelAndHref(
                childNode,
                lang,
                organizationPage,
                entryMap,
              )
              if (!label || !href) return null
              return {
                label,
                href,
                isActive: activeNodeIds.has(childNode.id),
              } as MidLink
            })
            .filter(Boolean) as MidLink[],
        } as TopLink
      }) ?? []
    ).filter(Boolean) as TopLink[]
  }

  @ResolveField(() => NavigationLinks, { nullable: true })
  async navigationLinks(
    @Parent() organizationPage: OrganizationPage,
  ): Promise<NavigationLinks> {
    const lang = organizationPage.lang ?? 'is'

    const entryIdsObject = this.extractNavigationLinkEntryIds(organizationPage)
    const entries =
      await this.cmsContentfulService.getOrganizationNavigationPages(
        entryIdsObject,
        lang,
      )
    const entryMap = new Map<
      string,
      { link: BottomLink; entry: Entry<unknown> }
    >()
    for (const entry of entries) {
      ;(
        entry.fields as { organizationPage: { fields: { slug: string } } }
      ).organizationPage = {
        fields: {
          slug: organizationPage.slug,
        },
      }
      const link = generateOrganizationSubpageLink(
        entry as IOrganizationParentSubpage | IOrganizationSubpage,
      )
      if (Boolean(link?.url) && Boolean(link?.text)) {
        entryMap.set(entry.sys.id, {
          link: {
            label: link.text,
            href: link.url,
          },
          entry,
        })
      }
    }

    const { breadcrumbs, activeNodeIds } = this.getBreadcrumbs(
      organizationPage,
      entryMap,
      lang,
    )
    const topLinks = this.getTopLinks(
      organizationPage,
      entryMap,
      lang,
      activeNodeIds,
    )

    let activeCategory: NavigationLinksCategory | null = null

    if (breadcrumbs.length > 2) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
      if (lastBreadcrumb.isCategory) {
        activeCategory = lastBreadcrumb
      }
      breadcrumbs.pop()
    }

    return {
      topLinks,
      breadcrumbs,
      activeCategory,
    }
  }
}
