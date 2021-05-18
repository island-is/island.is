import { gql } from '@apollo/client'
import { DocumentFragment, IDocument } from '../fragments/document.fragment'

export const GET_DOCUMENT_QUERY = gql`
  query getDocument($input: GetDocumentInput!) {
    getDocument(input: $input) {
      ...DocumentFragment
      content
    }
  }
  ${DocumentFragment}
`

export interface GetDocumentResponse {
  getDocument?: IDocument;
}
