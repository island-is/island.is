import {gql} from '@apollo/client';
import {PassportFragment} from '../fragments/passport.fragment';

export const GET_IDENTITY_DOCUMENT_QUERY = gql`
  query GetIdentityDocumentQuery {
    getIdentityDocument {
      ...identityDocumentFragment
    }
    getIdentityDocumentChildren {
      childNationalId
      childName
      passports {
        ...identityDocumentFragment
      }
    }
  }
  ${PassportFragment}
`;
