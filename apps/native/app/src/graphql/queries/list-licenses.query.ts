import { gql } from '@apollo/client';
import { GenericLicenseDataFieldFragment, GenericUserLicenseFragment, IGenericUserLicense } from '../fragments/license.fragment';

export const LIST_GENERIC_LICENSES_QUERY = gql`
  query genericLicenses {
    genericLicenses {
      ...GenericUserLicenseFragment
    }
  }
  ${GenericUserLicenseFragment}
  ${GenericLicenseDataFieldFragment}
`;

export interface ListGenericLicensesResponse {
  genericLicenses: IGenericUserLicense[];
}
