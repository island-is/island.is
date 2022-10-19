import { FishingLicenseCodeType } from '@island.is/clients/fishing-license'
import { FishingLicenseEnum } from '../types'

// Determines whether fishing license has a file upload field
export const licenseHasFileUploadField = (license: FishingLicenseEnum) => {
  return (
    license === FishingLicenseEnum.FREETIME ||
    license === FishingLicenseEnum.FREETIMEHOOK ||
    license === FishingLicenseEnum.FREETIMEHOOKMED ||
    license === FishingLicenseEnum.OCEANQUAHOGIN ||
    license === FishingLicenseEnum.COMMONWHELK ||
    license === FishingLicenseEnum.CRUSTACEANS
  )
}
