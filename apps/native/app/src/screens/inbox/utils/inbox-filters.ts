export type Filters = {
  opened?: boolean
  archived?: boolean
  bookmarked?: boolean
  subjectContains?: string
  senderNationalId?: string[]
  categoryIds?: string[]
  dateFrom?: Date
  dateTo?: Date
}

export const applyFilters = (filters?: Filters) => {
  return {
    archived: filters?.archived ? true : undefined,
    bookmarked: filters?.bookmarked ? true : undefined,
    opened: filters?.opened ? false : undefined,
    subjectContains: filters?.subjectContains ?? '',
    senderNationalId: filters?.senderNationalId ?? [],
    categoryIds: filters?.categoryIds ?? [],
    dateFrom: filters?.dateFrom,
    dateTo: filters?.dateTo,
  }
}
