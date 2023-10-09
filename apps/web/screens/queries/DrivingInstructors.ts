import gql from 'graphql-tag'

export const GET_DRIVING_INSTRUCTORS_QUERY = gql`
  query GetDrivingInstructors {
    drivingLicenseTeachersV4 {
      name
      nationalId
      driverLicenseId
    }
  }
`
