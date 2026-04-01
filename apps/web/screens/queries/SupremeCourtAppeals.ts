import { gql } from '@apollo/client'

export const GET_SUPREME_COURT_APPEALS_QUERY = gql`
  query GetSupremeCourtAppeals($input: WebSupremeCourtAppealsInput!) {
    webSupremeCourtAppeals(input: $input) {
      items {
        id
        title
        caseNumber
        appealPolicyDate
        registrationDate
        verdictDate
      }
      total
      input {
        page
      }
    }
  }
`
