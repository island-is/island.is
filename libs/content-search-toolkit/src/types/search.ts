import { SearchableTags } from '@island.is/api/schema'
import { elasticTagField } from './shared'

export interface SearchInput {
  queryString: string
  size?: number
  page?: number
  types?: string[]
  tags?: Omit<elasticTagField, 'value'>[]
  countTag?: SearchableTags[]
  countTypes?: boolean
  countProcessEntry?: boolean
}
