import gql from 'graphql-tag'

export const GET_UNIVERSITY_GATEWAY_PROGRAM_LIST = gql`
  query GetUniversityGatewayPrograms($input: GetProgramsInput!) {
    universityGatewayPrograms(input: $input) {
      data {
        nameIs
      }
    }
  }
`
