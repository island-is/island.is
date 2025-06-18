export interface VehicleProps {
  vehicleId: string
  vehicleType: string
}

export type SubmissionStatus = 'success' | 'error' | 'loading' | 'idle'

export interface Props {
  vehicles: Array<VehicleProps>
}

export interface TableData {
  bilnumer: unknown[]
  'seinasta skraning': unknown[]
  'seinasta skrada stada': unknown[]
  kilometrastada: unknown[]
}

export interface VehicleType extends VehicleProps {
  mileageUploadedFromFile?: number
  isCurrentlyEditing?: boolean
  lastMileageRegistration?: {
    date: Date
    origin: string
    mileage: number
    internalId?: number
  }
  registrationHistory?: Array<{
    date: Date
    origin: string
    mileage: number
  }>
  co2?: string
}

export interface VehicleList {
  vehicles: Array<VehicleType>
}
