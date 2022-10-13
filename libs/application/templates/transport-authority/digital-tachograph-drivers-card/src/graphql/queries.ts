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

//TODOx ekki nota, frekar LicenseQuery
export const GET_BIRTHPLACE = `
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      birthPlace
    }
  }
`
