import { gql } from '@apollo/client'

export const VALIDATE_INSTRUCTOR_QUERY = gql`
  query GetTypeByRegistrationNumber($input: ) {
    validateInstructor($input:) {
      name
    }
  }
`
