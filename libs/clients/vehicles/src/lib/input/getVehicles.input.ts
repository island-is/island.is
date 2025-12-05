export interface GetVehiclesInput {
  page: number
  pageSize: number
  query?: string
  includeNextMainInspectionDate?: boolean
  showOwned?: boolean
  showCoowned?: boolean
  showOperated?: boolean

  //DEPRECATED
  onlyMileageRequiredVehicles?: boolean
  onlyMileageRegisterableVehicles?: boolean
}
