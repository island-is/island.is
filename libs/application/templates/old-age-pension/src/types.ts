export interface combinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
}