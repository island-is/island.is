interface ValidationErrorMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}

export interface VehicleDetails {
  permno: string
  make: string
  color: string
  isDebtLess?: boolean
  validationErrorMessages?: ValidationErrorMessage[]
  requireMileage?: boolean
  mileageReading: string
  vehicleHasMilesOdometer?: boolean
}
