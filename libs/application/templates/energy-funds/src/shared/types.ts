export type VehiclesCurrentVehicle = {
  permno?: string
  make?: string
  color?: string
  role?: string
  firstRegistrationDate?: string
  newRegistrationDate?: string
  fuelCode?: string
  importCode?: string
  vehicleRegistrationCode?: string
  vin?: string
  vehicleGrant?: number
  hasReceivedSubsidy?: boolean
  vehicleGrantItemCode?: string
}

export type CurrentVehiclesAndRecords = {
  totalRecords: number
  vehicles: VehiclesCurrentVehicle[]
}
