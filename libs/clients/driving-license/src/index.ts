export * from './lib/drivingLicenseApi.service'
export * from './lib/drivingLicenseApi.module'
export * from './lib/drivingLicenseApi.types'

export { DrivingLicenseApi } from './lib/drivingLicenseApi.service'
export { DrivingLicenseApiConfig } from './lib/drivingLicenseApi.config'
export {
  DtoV5DriverLicenseDto,
  DtoV5CategoryDto,
  DtoErrorCodeDescriptionDto,
  ModelsV5PostTemporaryLicenseWithHealthDeclaration,
  ModelsHealthDeclarationModel,
} from './v5/index'

// Request models for the two v6 `withhealthdeclaration` endpoints. Exported from
// the barrel because Nx module boundaries block deep-importing `src/v6` from
// another lib.
export {
  ModelsV6PostTemporaryLicenseWithHealthDeclaration,
  ModelsV6PostFullLicenseWithHealthDeclaration,
} from './v6/index'
