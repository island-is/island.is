export interface BuildingDto {
  id: string
  address: string
  municipality?: string
  use?: string
  squareMeters?: number
  built?: string
  region?: string
  propertyManagement?: string[]
  accountManagement?: string[]
}
