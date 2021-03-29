import { gql } from '@apollo/client'
import { IDocument } from '../fragments/document.fragment'

export const GET_DOCUMENT_QUERY = gql`
  query getDocument($id: ID!) {
    Document(id: $id) {
      id
      date
      subject
      senderName
      senderNatReg
      opened
      fileType
      url
      content
    }
  }
`

export interface GetDocumentResponse {
  Document?: IDocument
}
