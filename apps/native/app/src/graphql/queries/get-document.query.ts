import { gql } from '@apollo/client'
import { IDocument } from '../fragments/document.fragment'

export const GET_DOCUMENT_QUERY = gql`
  query getDocument($input: GetDocumentInput!) {
    getDocument(input: $input) {
      fileType
      content
      html
      url
    }
  }
`

export interface GetDocumentResponse {
  getDocument?: {
    fileType: string;
    content: string;
    html: string;
    url: string;
  }
}
