import gql from 'graphql-tag'

export const GET_VERDICTS_QUERY = gql`
  query GetVerdicts($input: WebVerdictsInput!) {
    webVerdicts(input: $input) {
      items {
        title
        court
        caseNumber
        verdictDate
      }
      input {
        searchTerm
      }
    }
  }
`
