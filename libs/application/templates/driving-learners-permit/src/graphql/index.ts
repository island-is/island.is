import { gql } from '@apollo/client'
export const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const STUDENT_MENTORABILITY_QUERY = gql`
  query StudentMentorability($input: StudentMentorabilityInput!) {
    studentMentorability(input: $input) {
      isMentorable
    }
  }
`
