import {gql} from '@apollo/client';

export const PassportFragment = gql`
  fragment identityDocumentFragment on IdentityDocumentModel {
    number
    type
    verboseType
    subType
    status
    issuingDate
    expirationDate
    displayFirstName
    displayLastName
    mrzFirstName
    mrzLastName
    sex
    numberWithType
    expiryStatus
    expiresWithinNoticeTime
  }
`;

export interface IIdentityDocumentModel {
  __typename: 'IdentityDocumentModel';
  number: string;
  type: string;
  verboseType: string;
  subType: string;
  status: string;
  issuingDate: Date;
  expirationDate: Date;
  displayFirstName: string;
  displayLastName: string;
  mrzFirstName: string;
  mrzLastName: string;
  sex: string;
  numberWithType: string;
  expiryStatus: string;
  expiresWithinNoticeTime: boolean;
}
