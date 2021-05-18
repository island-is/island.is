import { elasticTagField } from './shared'

export interface SearchInput {
  queryString: string
  size?: number
  page?: number
  types?: string[]
  tags?: elasticTagField[]
  countTag?: string
  countTypes?: boolean
}
