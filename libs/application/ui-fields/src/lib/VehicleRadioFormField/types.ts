interface ValidationErrorMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}

export interface VehicleDetails {
  permno?: string
  make?: string
  color?: string
  role?: string
  requireMileage?: boolean | null
  mileageReading?: string | null
  isDebtLess?: boolean | null
  validationErrorMessages?: ValidationErrorMessage[]
  vehicleHasMilesOdometer?: boolean
}

export interface PlateOwnership {
  regno: string
  startDate: string
  endDate: string
  validationErrorMessages?: ValidationErrorMessage[]
}
