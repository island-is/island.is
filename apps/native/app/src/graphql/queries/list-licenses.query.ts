import { gql } from '@apollo/client';
import { GenericUserLicenseFragment, IGenericUserLicense } from '../fragments/license.fragment';

export const LIST_GENERIC_LICENSES_QUERY = gql`
  query genericLicenses {
    genericLicenses {
      ...GenericLicenseFragment
    }
  }
  ${GenericUserLicenseFragment}
`;

export interface ListGenericLicensesResponse {
  genericLicenses: IGenericUserLicense[];
}
