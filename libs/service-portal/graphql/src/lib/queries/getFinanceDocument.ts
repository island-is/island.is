import { gql } from '@apollo/client'

export const GET_FINANCE_DOCUMENT_DATA = gql`
  query getFinanceDocumentQuery($input: GetFinanceDocumentInput!) {
    getFinanceDocument(input: $input) {
      docment {
        type
        document
      }
    }
  }
`
