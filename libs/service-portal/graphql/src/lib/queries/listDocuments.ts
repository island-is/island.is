import { gql } from '@apollo/client'

export const LIST_DOCUMENTS = gql`
  query listDocuments {
    listDocuments {
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
