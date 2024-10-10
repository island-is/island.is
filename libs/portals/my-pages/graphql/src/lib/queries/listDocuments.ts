import { gql } from '@apollo/client'

export const LIST_DOCUMENTS = gql`
  query listDocumentsV2($input: GetDocumentListInput!) {
    listDocumentsV2(input: $input) {
      data {
        id
        subject
        senderName
        senderNatReg
        date
        fileType
        url
        opened
        bookmarked
        categoryId
      }
      totalCount
    }
  }
`
