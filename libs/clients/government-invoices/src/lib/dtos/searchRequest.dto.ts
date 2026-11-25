import { SortDirections } from '../../../gen/fetch'

export interface SearchRequestDto {
  limit?: number
  search?: string
  lookup?: string[]
  after?: string
  before?: string
  sortDirection?: SortDirections
}
