export type VehiclesCurrentVehicle = {
  permno?: string
  make?: string
  color?: string
  role?: string
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
