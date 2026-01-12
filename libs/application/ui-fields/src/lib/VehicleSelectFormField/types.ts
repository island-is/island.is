interface ValidationErrorMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}

export interface BasicVehicleDetails {
  permno?: string
  make?: string
  color?: string
  role?: string
}

export interface VehicleDetails extends BasicVehicleDetails {
  requireMileage?: boolean | null
  mileageReading?: string | null
  isDebtLess?: boolean | null
  validationErrorMessages?: ValidationErrorMessage[]
  vehicleHasMilesOdometer?: boolean
}

export interface BasicPlateOwnership {
  regno?: string
  startDate?: string
  endDate?: string
  validationErrorMessages?: ValidationErrorMessage[]
}

export interface PlateOwnershipValidation {
  validationErrorMessages?: ValidationErrorMessage[]
}

export interface PlateOwnership
  extends BasicPlateOwnership,
    PlateOwnershipValidation {}
