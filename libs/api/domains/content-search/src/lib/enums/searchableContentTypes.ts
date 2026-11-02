import { SearchableContentTypes } from '@island.is/shared/types'
export { SearchableContentTypes } from '@island.is/shared/types'
import { registerEnumType } from '@nestjs/graphql'

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })

// Project subpages are only searched from within their project, so callers have to explicitly ask for them
export const defaultSearchableContentTypes = Object.values(
  SearchableContentTypes,
).filter((type) => type !== SearchableContentTypes.webProjectSubpage)
