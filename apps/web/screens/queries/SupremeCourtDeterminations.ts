import { gql } from '@apollo/client'

export const GET_SUPREME_COURT_DETERMINATIONS_QUERY = gql`
  query GetSupremeCourtDeterminations(
    $input: WebSupremeCourtDeterminationsInput!
  ) {
    webSupremeCourtDeterminations(input: $input) {
      items {
        id
        title
        subtitle
        date
        keywords
      }
      total
      input {
        page
      }
    }
  }
`

export const GET_SUPREME_COURT_DETERMINATION_BY_ID_QUERY = gql`
  query GetSupremeCourtDeterminationById(
    $input: WebSupremeCourtDeterminationByIdInput!
  ) {
    webSupremeCourtDeterminationById(input: $input) {
      item {
        id
        title
      }
    }
  }
`
