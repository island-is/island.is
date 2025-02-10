export interface MileageReadingDto {
  isEditing: boolean
  canUserRegisterVehicleMileage?: boolean
  readings: Array<{
    date?: Date
    origin?: string
    mileage?: number
  }>
}
