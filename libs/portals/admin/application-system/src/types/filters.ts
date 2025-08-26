export enum MultiChoiceFilter {
  INSTITUTION = 'institution',
  STATUS = 'status',
  APPLICATION = 'application',
  TYPE_ID = 'type_id',
}

export type ApplicationFilters = {
  searchStr?: string
  nationalId?: string
  period: {
    from?: Date
    to?: Date
  }
  institution?: string
  status?: string[]
  typeId?: string
}
