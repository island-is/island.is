import gql from 'graphql-tag'

export const GET_VERDICTS_QUERY = gql`
  query GetVerdicts($input: WebVerdictsInput!) {
    webVerdicts(input: $input) {
      items {
        id
        title
        court
        caseNumber
        verdictDate
        keywords
        presentings
        presidentJudge {
          name
          title
        }
      }
      input {
        searchTerm
      }
    }
  }
`

export const GET_VERDICT_BY_ID_QUERY = gql`
  query GetVerdictById($input: WebVerdictByIdInput!) {
    webVerdictById(input: $input) {
      item {
        title
      }
    }
  }
`
