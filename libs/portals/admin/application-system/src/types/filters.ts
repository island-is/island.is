export enum MultiChoiceFilter {
  INSTITUTION = 'institution',
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
  typeIdValue?: string
}
