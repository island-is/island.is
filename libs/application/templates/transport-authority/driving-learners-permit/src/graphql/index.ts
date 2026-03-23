import { gql } from '@apollo/client'

export const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const LOOKUP_STUDENT_QUERY = gql`
  query DrivingLicenseStudentCanGetPracticePermit(
    $input: StudentCanGetPracticePermitInput!
  ) {
    drivingLicenseStudentCanGetPracticePermit(input: $input) {
      errorCode
      isOk
    }
  }
`

export const ELIGIBILITY_QUERY = gql`
  query EligibilityQuery {
    learnerMentorEligibility {
      isEligible
      requirements {
        key
        requirementMet
      }
    }
  }
`
