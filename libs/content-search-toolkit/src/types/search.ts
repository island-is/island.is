import { elasticTagField } from './shared'

export interface SearchInput {
  queryString: string
  size?: number
  page?: number
  types?: string[]
  tags?: Omit<elasticTagField, 'value'>[]
  contentfulTags?: string[]
  countTag?: string[]
  countTypes?: boolean
  countProcessEntry?: boolean
}
