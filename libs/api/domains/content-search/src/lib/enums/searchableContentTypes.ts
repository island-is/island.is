import { SearchableContentTypes } from '@island.is/shared/types'
export { SearchableContentTypes } from '@island.is/shared/types'
import { registerEnumType } from '@nestjs/graphql'

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })
