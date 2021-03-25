import { gql } from '@apollo/client';
import { DocumentFragment } from '../fragments/document.fragment';

export const LIST_DOCUMENTS_QUERY = gql`
  query {
    listDocuments {
      id
      date
      subject
      senderName
      senderNatReg
      opened
      fileType
      url
      #...DocumentFragment
    }
  }
  ${DocumentFragment}
`;

export interface IDocumnet {
  id: string;
  date: string;
  subject: string;
  senderName: string;
  senderNatReg: string;
  opened: boolean;
  fileType: string;
  url: string;
}

export interface ListDocumentsResponse {
  listDocuments: IDocumnet[];
}
