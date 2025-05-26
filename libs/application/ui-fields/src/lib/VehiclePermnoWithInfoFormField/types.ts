import { FormText } from '@island.is/application/types'

export interface VehicleDetails {
  permno: string
  make: string
  color: string
}

export interface VehicleValidation {
  errorMessages?: FormText[]
}
