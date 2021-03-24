import { gql } from '@apollo/client';

export const DocumentFragment = gql`
  fragment DocumentFragment on Document {
    id
    title
    subtitle
  }
`;
