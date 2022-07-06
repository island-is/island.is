import { gql } from '@apollo/client'

export const LIST_DOCUMENTS = gql`
  query listDocuments($input: GetDocumentListInput!) {
    listDocuments(input: $input) {
      id
      subject
      senderName
      senderNatReg
      date
      fileType
      url
      opened
      categoryId
    }
  }
`
