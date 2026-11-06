import { gql } from '@apollo/client'

export const GET_COURT_OF_APPEAL_APPEALS_QUERY = gql`
  query GetCourtOfAppealAppeals($input: WebCourtOfAppealAppealsInput!) {
    webCourtOfAppealAppeals(input: $input) {
      items {
        id
        title
        caseNumber
        status
        appealDate
      }
      total
      input {
        page
      }
    }
  }
`
