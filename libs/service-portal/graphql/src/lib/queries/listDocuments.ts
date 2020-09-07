import { gql } from '@apollo/client'

export const LIST_DOCUMENTS = gql`
  query listDocuments($input: ListDocumentsInput!) {
    listDocuments(input: $input) {
      id
      subject
      senderName
      senderNatReg
      date
      opened
    }
  }
`
