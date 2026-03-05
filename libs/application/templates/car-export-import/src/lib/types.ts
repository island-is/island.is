export interface VehicleWithMileage {
  permno: string | null
  milage: number | null
  type: string | null
}

export interface VehiclesResponse {
  vehicles: VehicleWithMileage[]
  totalRecords: number
}

export const SERVER_SIDE_VEHICLE_THRESHOLD = 20
