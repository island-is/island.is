import type {
  ProjectParentSubpage,
  ProjectSubpage,
} from '@island.is/web/graphql/schema'
import type { LinkType } from '@island.is/web/hooks/useLinkResolver'

type ProjectSearchResultItem =
  | Pick<
      ProjectSubpage,
      '__typename' | 'slug' | 'projectSlug' | 'parentSubpageSlug'
    >
  | Pick<ProjectParentSubpage, '__typename' | 'slug' | 'projectSlug'>

// Subpages of project pages are only search results when a search is scoped to their project
export const getProjectSearchResultLink = (
  item: ProjectSearchResultItem,
): { linkType: LinkType; variables: string[] } => {
  const projectSlug = item.projectSlug ?? ''

  // Chapters link to their place under their parent subpage
  if (
    item.__typename === 'ProjectSubpage' &&
    'parentSubpageSlug' in item &&
    item.parentSubpageSlug
  ) {
    return {
      linkType: 'projectparentsubpagechild',
      variables: [projectSlug, item.parentSubpageSlug, item.slug],
    }
  }

  return { linkType: 'projectsubpage', variables: [projectSlug, item.slug] }
}
