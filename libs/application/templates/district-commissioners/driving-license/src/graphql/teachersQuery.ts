import { gql } from '@apollo/client'

// Fetches the current list of driving instructors live (instead of relying on
// the snapshot frozen into external data when the application was created), so
// newly-registered instructors show up and de-licensed ones drop off.
export const GET_DRIVING_LICENSE_TEACHERS = gql`
  query DrivingLicenseTeachers {
    drivingLicenseTeachersV4 {
      name
      nationalId
    }
  }
`
