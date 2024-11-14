import { VehicleValidationErrorMessage } from '@island.is/api/schema'

export interface VehicleDetails {
  permno?: string
  make?: string
  color?: string
  role?: string
  requireMileage?: boolean | null
  mileageReading?: string | null
  isDebtLess?: boolean | null
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}
