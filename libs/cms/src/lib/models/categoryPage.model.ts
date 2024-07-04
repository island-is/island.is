import { createUnionType } from '@nestjs/graphql'

import { Article } from './article.model'
import { Manual } from './manual.model'

export const CategoryPage = createUnionType({
  name: 'CategoryPage',
  types: () => [Article, Manual],
  resolveType: (document) => document.typename, // typename is appended to request on mapping
})
