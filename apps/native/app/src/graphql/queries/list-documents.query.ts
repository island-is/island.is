import {gql} from '@apollo/client';

export const LIST_DOCUMENTS_QUERY = gql`
  query listDocumentsV2 {
    listDocumentsV2(input: {}) {
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
