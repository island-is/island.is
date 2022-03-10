import { gql } from '@apollo/client'

export const GET_ANNUAL_STATUS_DOCUMENT_DATA = gql`
  query getAnnualStatusDocumentQuery($input: GetAnnualStatusDocumentInput!) {
    getAnnualStatusDocument(input: $input) {
      docment {
        type
        document
      }
    }
  }
`
