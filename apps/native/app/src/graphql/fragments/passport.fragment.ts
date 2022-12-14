import { gql } from '@apollo/client';

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

