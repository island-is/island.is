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

export const GET_SYSLUMENN_DRIVING_INSTRUCTORS_QUERY = gql`
  query GetSyslumennDrivingInstructors {
    getSyslumennDrivingInstructors {
      list {
        name
        postalCode
        municipality
      }
    }
  }
`
