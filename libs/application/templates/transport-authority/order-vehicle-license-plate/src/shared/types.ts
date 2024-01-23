export type VehiclesCurrentVehicle = {
  permno?: string
  make?: string
  color?: string
  role?: string
}

type VehicleValidationErrorMessage = {
  errorNo?: string | null
  defaultMessage?: string | null
}

export type VehiclesCurrentVehicleWithPlateOrderChecks = {
  permno?: string
  make?: string
  color?: string
  role?: string
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

export type DeliveryStation = {
  name?: string | null
  value: string
}

export type PlateType = {
  code?: string | null
  name?: string | null
  plateHeight?: number | null
  plateWidth?: number | null
}

export type CurrentVehiclesAndRecords = {
  totalRecords: number
  vehicles: VehiclesCurrentVehicle[]
}
