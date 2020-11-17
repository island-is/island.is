import { elasticTagField } from '.';

export interface SearchInput {
  queryString: string
  size?: number
  page?: number
  types?: string[]
  tags?: Omit<elasticTagField, 'value'>[]
  countTag?: string
}