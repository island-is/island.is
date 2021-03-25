import { gql } from '@apollo/client';

export const DocumentFragment = gql`
  fragment DocumentFragment on Document {
    id
    date
    subject
    senderName
    senderNatReg
    opened
    fileType
    url
  }
`;
