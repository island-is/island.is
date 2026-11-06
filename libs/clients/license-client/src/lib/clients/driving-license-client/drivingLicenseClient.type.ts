import { DtoV5DriverLicenseDto } from '@island.is/clients/driving-license'

export type DrivingLicenseVerifyExtraData = {
  name: string
  nationalId: string
  picture?: string
}

export type DriversLicenseWithExtras = DtoV5DriverLicenseDto & {
  totalPenaltyPoints?: number
  hasActiveDeprivation?: boolean
}
