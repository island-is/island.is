import { gql } from '@apollo/client'

export const GET_DOCUMENT = gql`
  query GetDocument($input: GetDocumentInput!) {
    getDocument(input: $input) {
      url
    }
  }
`
