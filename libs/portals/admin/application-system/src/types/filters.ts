export type ApplicationFilters = {
  searchStr?: string
  nationalId?: string
  period: {
    from?: Date
    to?: Date
  }
  institution?: string
  typeIdValue?: string
}

export type ApplicationOrigin = 'formSystem' | 'applicationSystem'
