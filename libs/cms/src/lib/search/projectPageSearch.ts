// Project subpages and parent subpages are indexed as internal documents.
// They never show up as search results on their own, instead the content search
// uses them to find project pages and to list the matching subpages under each project page.

export const PROJECT_SUBPAGE_SEARCH_TYPE = 'webProjectSubpage'
export const PROJECT_PARENT_SUBPAGE_SEARCH_TYPE = 'webProjectParentSubpage'

export const PROJECT_PAGE_CHILD_SEARCH_TYPES = [
  PROJECT_SUBPAGE_SEARCH_TYPE,
  PROJECT_PARENT_SUBPAGE_SEARCH_TYPE,
]

// Tag type whose key is the id of the project page a child document belongs to
export const PROJECT_PAGE_SEARCH_TAG_TYPE = 'projectPage'

// Tag type whose key is the slug of a project, used to scope a search to a single project.
// The project page and its children are all tagged with it
export const PROJECT_SEARCH_TAG_TYPE = 'project'

export interface ProjectPageSearchChapter {
  id: string
  title: string
  slug: string
}

// What gets stored in the 'response' field of the child documents.
// Urls are created when searching so they follow the project page slug
export type ProjectPageSearchChild =
  | {
      typename: 'ProjectSubpage'
      id: string
      title: string
      slug: string
      projectPageId: string
      // Lets the child link to itself when it's shown as a search result within its project
      projectSlug?: string
    }
  | {
      typename: 'ProjectParentSubpage'
      id: string
      title: string
      slug: string
      projectPageId: string
      projectSlug?: string
      chapters: ProjectPageSearchChapter[]
    }
