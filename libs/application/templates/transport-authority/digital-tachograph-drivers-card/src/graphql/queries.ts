export const GET_LICENSE_CATEGORIES = `
  query LicenseQuery {
    drivingLicense {
      categories {
        name
      }
    }
  }
`
