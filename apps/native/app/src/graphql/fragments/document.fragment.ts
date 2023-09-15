import {gql} from '@apollo/client';

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

export interface IDocument {
  id: string;
  date: string;
  subject: string;
  senderName: string;
  senderNatReg: string;
  opened: boolean;
  fileType: string;
  url: string;
  content?: string;
  html?: string;
}
