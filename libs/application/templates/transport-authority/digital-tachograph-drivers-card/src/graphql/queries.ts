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

export const GET_BIRTHPLACE = `
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      birthPlace
    }
  }
`

export const GET_BIRTHPLACEx = `
  query NationalRegistryUserQuery {
    nationalRegistryUserV2 {
      birthplace {
        location
        municipalityCode
        dateOfBirth
      }
    }
  }
`
