export interface Status {
  applicationStatus: 'open' | 'closed' | 'unknown'
  deadlineStatus?: string
  deadlinePeriod?: string
  note?: string
}
