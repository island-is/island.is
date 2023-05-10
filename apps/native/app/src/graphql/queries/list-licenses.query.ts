import {gql} from '@apollo/client';
import {
  GenericLicenseDataFieldFragment,
  GenericUserLicenseFragment,
  IGenericUserLicense,
} from '../fragments/license.fragment';
import {GenericLicenseType} from './get-license.query';

export const LIST_GENERIC_LICENSES_QUERY = gql`
  query genericLicenses($input: GetGenericLicensesInput!, $locale: String) {
    genericLicenses(input: $input, locale: $locale) {
      ...GenericUserLicenseFragment
    }
  }
  ${GenericUserLicenseFragment}
  ${GenericLicenseDataFieldFragment}
`;

export interface ListGenericLicensesResponse {
  genericLicenses: IGenericUserLicense[];
}

type GenericLicenseTypeType = typeof GenericLicenseType;

export interface GetGenericLicensesInput {
  input: {
    includedTypes?: GenericLicenseTypeType[];
    excludedTypes?: GenericLicenseTypeType[];
    force?: boolean;
    onlyList: boolean;
  };
}
