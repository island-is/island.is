import {gql} from '@apollo/client';

export const LIST_DOCUMENTS_QUERY = gql`
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
        categoryId
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
  url: string;
  categoryId?: string;
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
  page?: number;
  pageSize?: number;
  isLegalGuardian?: boolean | null;
};
