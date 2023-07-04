export enum MultiChoiceFilter {
  INSTITUTION = 'institution',
  STATUS = 'status',
  APPLICATION = 'application',
}

export type ApplicationFilters = {
  nationalId?: string
  period: {
    from?: Date
    to?: Date
  }
  institution?: string
  status?: string[]
}
