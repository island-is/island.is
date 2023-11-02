import {gql} from '@apollo/client';

export const LIST_DOCUMENT_FRAGMENT = gql`
  fragment ListDocument on Document {
    id
    subject
    senderName
    senderNatReg
    date
    fileType
    url
    opened
    categoryId
    bookmarked
    archived @client
  }
`;

export const LIST_DOCUMENTS_QUERY = gql`
  ${LIST_DOCUMENT_FRAGMENT}
  query listDocumentsV2($input: GetDocumentListInput!) {
    listDocumentsV2(input: $input) {
      data {
        ...ListDocument
      }
      totalCount
    }
  }
`;

export type DocumentV2 = {
  id: string;
  date: Date;
  subject: string;
  senderName: string;
  senderNatReg: string;
  opened: boolean;
  fileType: string;
  bookmarked: boolean;
  url: string;
  categoryId?: string;
  archived?: boolean;
};

export type ListDocumentsV2 = {
  data: DocumentV2[];
  totalCount: number;
};

export type GetDocumentListInput = {
  senderKennitala?: string;
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string;
  subjectContains?: string;
  typeId?: string;
  sortBy?: string;
  order?: string;
  opened?: boolean;
  bookmarked?: boolean;
  archived?: boolean;
  page?: number;
  pageSize?: number;
  isLegalGuardian?: boolean | null;
};
