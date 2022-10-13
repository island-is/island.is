export const GET_LICENSE_CATEGORIES = `
  query LicenseQuery {
    drivingLicense {
      categories {
        name
      }
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
