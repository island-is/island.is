export interface GetVehiclesInput {
  page: number
  pageSize: number
  query?: string
  showOwned?: boolean
  showCoowned?: boolean
  showOperated?: boolean
  onlyMileageRequiredVehicles?: boolean
  onlyMileageRegisterableVehicles?: boolean
}
