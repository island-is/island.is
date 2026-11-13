import { elasticTagField, sortRule } from './shared'

export interface SearchInput {
  queryString: string
  size?: number
  page?: number
  sort?: sortRule[]
  types?: string[]
  tags?: Omit<elasticTagField, 'value'>[]
  excludedTags?: Omit<elasticTagField, 'value'>[]
  contentfulTags?: string[]
  countTag?: string[]
  countTypes?: boolean
  countProcessEntry?: boolean
  useQuery?: string
  // Documents that should also match the query string, e.g. project pages whose subpages match it
  additionalDocumentMatches?: { id: string; boost: number }[]
}
