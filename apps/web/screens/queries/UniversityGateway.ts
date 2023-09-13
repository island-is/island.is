import gql from 'graphql-tag'

export const GET_UNIVERSITY_GATEWAY_PROGRAM_LIST = gql`
  query GetUniversityGatewayPrograms {
    universityGatewayPrograms {
      nameIs
    }
  }
`
