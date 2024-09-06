export interface BulkVehicleList {
  vehicles: Array<{
    title: string
    permNo: string
    vehicleMileageRegistration?: {
      canRegisterMileage: boolean
    }
  }>
  pageNumber?: number
  pageSize?: number
  totalPages?: number
  totalRecords?: number
}
