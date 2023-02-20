import { gql } from '@apollo/client';
import { IDocument } from '../fragments/document.fragment';

export const LIST_DOCUMENTS_QUERY = gql`
  query listDocuments {
    listDocuments {
      id
      date
      subject
      senderName
      senderNatReg
      opened
      fileType
      url
    }
  }
`;

export interface ListDocumentsResponse {
  listDocuments: IDocument[];
}
