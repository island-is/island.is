import { gql } from '@apollo/client'

export const GET_DOCUMENT = gql`
  query GetDocument($input: GetDocumentInput!) {
    getDocument(input: $input) {
      id
      date
      subject
      senderName
      senderNatReg
      opened
    }
  }
`
