export * from './lib/services/drivingLicenseApi.service'
export * from './lib/drivingLicenseApi.module'
export * from './lib/drivingLicenseApi.types'

export { DrivingLicenseApi } from './lib/services/drivingLicenseApi.service'
export { PenaltyPointsClientService } from './lib/services/penaltyPoints.service'
export { DrivingLicenseApiConfig } from './lib/drivingLicenseApi.config'
export {
  DtoV5DriverLicenseDto,
  DtoV5CategoryDto,
  DtoErrorCodeDescriptionDto,
  DtoV5DeprivationDto,
  DtoV5PenaltyPointDetailDto,
  ModelsV5PostTemporaryLicenseWithHealthDeclaration,
  ModelsHealthDeclarationModel,
} from './v5/index'
