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

// Determines whether fishing license has a dropdown to select area (veiðisvæði)
export const licenseHasAreaSelection = (license: FishingLicenseEnum) => {
  return license === FishingLicenseEnum.GREYSLEPP
}

// Determines whether fishing license has field to input number of roe nets (fjöldi hrognkelsaneta)
export const licenseHasRoeNetField = (license: FishingLicenseEnum) => {
  return license === FishingLicenseEnum.GREYSLEPP
}

// Determines whether fishing license has field to input length of rail net (teinanetslengd)
export const licenseHasRailNetLengthField = (license: FishingLicenseEnum) => {
  return license === FishingLicenseEnum.GREYSLEPP
}
