export interface VehicleProps {
  vehicleId: string
  vehicleType: string
  lastMileageRegistration?: Date
}

export type SubmissionStatus = 'success' | 'error' | 'loading' | 'idle'

export interface Props {
  vehicles: Array<VehicleProps>
}

export interface VehicleType extends VehicleProps {
  mileageUploadedFromFile?: number
  isCurrentlyEditing?: boolean
  registrationHistory?: Array<{
    date: Date
    origin: string
    mileage: number
  }>
}

export interface VehicleList {
  vehicles: Array<VehicleType>
}
