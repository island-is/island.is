export type VehiclesCurrentVehicle = {
  permno?: string
  make?: string
  color?: string
  role?: string
}

export type CurrentVehiclesAndRecords = {
  totalRecords: number
  vehicles: VehiclesCurrentVehicle[]
}
