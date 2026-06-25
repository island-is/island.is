export const DEFAULT_PAGE_SIZE = 25

export type SeaServiceState = {
  dateFrom?: Date
  dateTo?: Date
  rankId?: string
  length?: string
  power?: string
  tonnage?: string
  page?: number
  pageSize?: number
}

export const defaultState: SeaServiceState = {}
