export interface VehicleProps {
  vehicleId: string
  vehicleType: string
  lastMileageRegistration: Date
  submissionStatus: SubmissionState
}

export type SubmissionState =
  | 'idle'
  | 'success'
  | 'failure'
  | 'submit'
  | 'submit-all'
  | 'waiting-success'
  | 'waiting-failure'

export interface Props {
  vehicles: Array<VehicleProps>
}

export interface VehicleType {
  vehicleId: string
  vehicleType: string
  submissionStatus: SubmissionState
  mileageUploadedFromFile?: number
  lastRegistrationDate?: Date
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
