import { FishingLicenseEnum } from '../types'

export const FILE_UPLOAD_ACCEPT = '.pdf, .jpg, .jpeg, .png'

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
export const licenseHasRailNetAndRoeNetField = (
  license: FishingLicenseEnum,
) => {
  return license === FishingLicenseEnum.GREYSLEPP
}

export const MAXIMUM_TOTAL_RAIL_NET_LENGTH = 7500

// Calculates the total sum of rails depending on the number of roe nets
// To show the calculated result in front end or to check input for validation
// Takes in a string to support text input
export const calculateTotalRailNet = (roenet?: string, railnet?: string) => {
  if (!roenet || !railnet) return 0
  try {
    const roenetInt = parseInt(roenet.trim(), 10)
    const railnetInt = parseInt(railnet.split('m').join('').trim(), 10)
    return !isNaN(roenetInt) && !isNaN(railnetInt) ? roenetInt * railnetInt : 0
  } catch (e) {
    return 0
  }
}
