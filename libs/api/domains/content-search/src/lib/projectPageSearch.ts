import type { GroupedByTagSearchGroup } from '@island.is/content-search-toolkit'
import type { ProjectPageSearchChild } from '@island.is/cms'
import { getProjectPageUrlPrefix } from '@island.is/shared/utils'

export const MAX_PROJECT_PAGE_SEARCH_CHILD_LINKS = 4

export interface ProjectPageSearchChildLink {
  id: string
  label: string
  href: string
}

export interface ProjectPageChildMatches {
  projectPageId: string
  score: number
  children: ProjectPageSearchChild[]
}

interface ProjectPageSearchResultItem {
  id?: string
  slug?: string
  sidebarLinks?: {
    primaryLink?: { id?: string; text?: string; url?: string } | null
  }[]
}

const parseChild = (response?: string): ProjectPageSearchChild | null => {
  if (!response) {
    return null
  }
  try {
    return JSON.parse(response) as ProjectPageSearchChild
  } catch {
    return null
  }
}

export const mapProjectPageChildMatches = (
  groups: GroupedByTagSearchGroup[],
): ProjectPageChildMatches[] =>
  groups
    .map((group) => ({
      projectPageId: group.key,
      score: group.documents.maxScore.value ?? 0,
      children: group.documents.topHits.hits.hits
        .map((hit) => parseChild(hit._source.response))
        .filter(
          (child): child is ProjectPageSearchChild =>
            Boolean(child) && child?.projectPageId === group.key,
        ),
    }))
    .filter((match) => match.score > 0 && match.children.length > 0)

export const getProjectPageSearchChildLinks = (
  projectPage: ProjectPageSearchResultItem,
  matches: ProjectPageChildMatches | undefined,
  locale: string,
  maxLinks = MAX_PROJECT_PAGE_SEARCH_CHILD_LINKS,
): ProjectPageSearchChildLink[] => {
  const slug = projectPage.slug?.trim()
  if (!slug) {
    return []
  }

  const baseUrl = `/${getProjectPageUrlPrefix(locale)}/${slug}`
  const links: ProjectPageSearchChildLink[] = []

  const addLink = (link: ProjectPageSearchChildLink) => {
    if (
      links.length < maxLinks &&
      link.label &&
      link.href !== baseUrl &&
      !links.some(
        (existing) => existing.href === link.href || existing.id === link.id,
      )
    ) {
      links.push(link)
    }
  }

  const children = matches?.children ?? []

  // Chapters link to their place under their parent subpage
  const parentByChapterId = new Map<
    string,
    Extract<ProjectPageSearchChild, { typename: 'ProjectParentSubpage' }>
  >()
  for (const child of children) {
    if (child.typename === 'ProjectParentSubpage') {
      for (const chapter of child.chapters) {
        if (!parentByChapterId.has(chapter.id)) {
          parentByChapterId.set(chapter.id, child)
        }
      }
    }
  }

  // Subpages that match the search query come first, best match first
  for (const child of children) {
    if (child.typename === 'ProjectParentSubpage') {
      addLink({
        id: child.id,
        label: child.title,
        href: `${baseUrl}/${child.slug}`,
      })
      continue
    }

    const parent = parentByChapterId.get(child.id)
    addLink({
      id: child.id,
      label: child.title,
      href: parent
        ? `${baseUrl}/${parent.slug}/${child.slug}`
        : `${baseUrl}/${child.slug}`,
    })
  }

  // Then the project page's own navigation, in the order editors put it in
  for (const linkGroup of projectPage.sidebarLinks ?? []) {
    const link = linkGroup?.primaryLink
    if (link?.url?.startsWith(`${baseUrl}/`) && link.text) {
      addLink({
        id: link.id ?? link.url,
        label: link.text,
        href: link.url,
      })
    }
  }

  return links
}
