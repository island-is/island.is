import { elasticTagField } from './shared'

export interface SearchInput {
  queryString: string
  size?: number
  page?: number
  types?: string[]
  tags?: Omit<elasticTagField, 'value'>[]
  countTag?: string
  countTypes?: boolean
  fuzzy?: boolean
  fuzzyFactor?: number
}
