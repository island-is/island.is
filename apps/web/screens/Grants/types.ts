export interface Status {
  applicationStatus: 'open' | 'closed' | 'unknown'
  deadlineStatus?: string
  deadlinePeriod?: string
  note?: string
  hasTime?: boolean
}

export const Availability = ['closed', 'open'] as const
