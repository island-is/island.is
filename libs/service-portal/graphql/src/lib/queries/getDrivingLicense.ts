import { gql } from '@apollo/client'

export const GET_DRIVING_LICENSE = gql`
  query DrivingLicenseQuery {
    drivingLicense {
      id
      name
      issued
      expires
      categories {
        name
        issued
        expires
      }
    }
  }
`
