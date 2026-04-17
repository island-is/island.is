import { gql } from '@apollo/client'

export const GET_COURT_OF_APPEAL_APPEALS_QUERY = gql`
  query GetCourtOfAppealAppeals {
    webCourtOfAppealAppeals {
      items {
        id
        title
        caseNumber
        appealDate
        verdictDate
      }
      total
    }
  }
`
