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
