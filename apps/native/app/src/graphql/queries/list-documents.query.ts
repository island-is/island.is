import { gql } from '@apollo/client';
import { DocumentFragment } from '../fragments/document.fragment';

export const LIST_DOCUMENTS_QUERY = gql`
  query {
    listDocuments {
      id
      title
      subtitle
      #...DocumentFragment
    }
  }
  ${DocumentFragment}
`;
