export const GET_DRIVING_LICENSE = `
  query LicenseQuery {
    drivingLicense {
      id
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

export const GET_QUALITY_PHOTO_AND_SIGNATURE = `
  query QualityPhotoAndSignatureQuery {
    digitalTachographQualityPhotoAndSignature {
      hasPhoto
      photoDataUri
      hasSignature
      signatureDataUri
    }
  }
`

export const GET_NEWEST_DRIVERS_CARD = `
  query NewestDriversCardQuery {
    digitalTachographNewestDriversCard {
      applicationCreatedAt
      cardNumber
      cardValidFrom
      cardValidTo
      isValid
    }
  }
`

export const CHECK_TACHO_NET_EXISTS = `
  query TachoNetExistsQuery($input: CheckTachoNetInput!) {
    digitalTachographTachoNetExists(input: $input) {
      exists
    }
  }
`
