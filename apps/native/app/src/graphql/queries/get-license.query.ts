import {gql} from '@apollo/client';
import {
  GenericLicenseDataFieldFragment,
  GenericUserLicenseFragment,
  IGenericUserLicense,
} from '../fragments/license.fragment';

export const GET_GENERIC_LICENSE_QUERY = gql`
  query getGenericLicense($input: GetGenericLicenseInput!) {
    genericLicense(input: $input) {
      ...GenericUserLicenseFragment
    }
  }
  ${GenericUserLicenseFragment}
  ${GenericLicenseDataFieldFragment}
`;

export interface GetLicenseResponse {
  genericLicense?: IGenericUserLicense;
}

export enum GenericLicenseType {
  DriversLicense = 'DriversLicense',
  MachineLicense = 'MachineLicense',
  AdrLicense = 'AdrLicense',
  FirearmLicense = 'FirearmLicense',
  HuntingLicense = 'HuntingLicense',
  DisabilityLicense = 'DisabilityLicense',
  PCard = 'PCard',
}

export interface GetGenericLicenseInput {
  input: {
    licenseType: GenericLicenseType;
  };
}
