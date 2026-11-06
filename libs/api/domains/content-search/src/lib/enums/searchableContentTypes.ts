import { SearchableContentTypes } from '@island.is/shared/types'
export { SearchableContentTypes } from '@island.is/shared/types'
import { registerEnumType } from '@nestjs/graphql'

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })

// Project subpages are only searchable within their project, that is when a search is filtered by a project tag
export const PROJECT_SCOPED_CONTENT_TYPES: string[] = [
  SearchableContentTypes.webProjectSubpage,
  SearchableContentTypes.webProjectParentSubpage,
]

export const DEFAULT_SEARCHABLE_CONTENT_TYPES = Object.values(
  SearchableContentTypes,
).filter((type) => !PROJECT_SCOPED_CONTENT_TYPES.includes(type))
