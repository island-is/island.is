import { VehicleMiniDto } from '@island.is/clients/vehicles'

export interface VehicleDto extends VehicleMiniDto {
  mileage: string
  selectedForRecycling?: boolean // true for selected vehicles on submitted application
  markedForRecycling?: boolean // used for displaying selected vehicles in overview
  colorName?: string
  requiresMileageRegistration?: boolean
  modelYear?: number
  latestMileage?: number
}
