import { ValidationMessage } from '@island.is/clients/transport-authority/vehicle-owner-change'

export interface PlateOwnership {
  regno: string
  startDate: Date
  endDate: Date
  nationalId: string
  name: string
}

export interface PlateOwnershipValidation {
  hasError: boolean
  errorMessages?: Array<ValidationMessage>
  infoMessages?: Array<ValidationMessage>
}
