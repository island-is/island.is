export type SortKeyType = 'Date' | 'Subject' | 'Sender' | 'Category' | 'Type'
export type SortDirectionType = 'Ascending' | 'Descending'

export type SortType = { direction: SortDirectionType; key: SortKeyType }
export type FilterValuesType = {
  dateFrom: Date | null
  dateTo: Date | null
  searchQuery: string
  showUnread: boolean | undefined
  activeCategories: string[]
  activeSenders: string[]
}

export const defaultFilterValues = {
  dateFrom: null,
  dateTo: null,
  activeCategories: [],
  activeSenders: [],
  searchQuery: '',
  showUnread: false,
}
