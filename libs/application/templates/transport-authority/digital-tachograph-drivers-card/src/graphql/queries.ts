export const GET_DRIVING_LICENSE = `
  query LicenseQuery {
    drivingLicense {
      categories {
        name
      }
      birthCountry
    }
  }
`

export const GET_BIRTHPLACE_AND_DOMICILE = `
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      address {
        code
      }
      birthPlace
    }
  }
`

export const QUALITY_PHOTO_AND_SIGNATURE = `
  query QualityPhotoAndSignature {
    digitalTachographQualityPhotoAndSignature {
      hasPhoto
      photoDataUri
      hasSignature
      signatureDataUri
    }
  }
`
