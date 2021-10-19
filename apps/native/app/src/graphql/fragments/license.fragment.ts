import { gql } from '@apollo/client';

export const GenericLicenseDataFieldFragment = gql`
  fragment GenericLicenseDataFieldFragment on GenericLicenseDataField {
    type
    name
    label
    value
    fields {
      type
      name
      label
      value
      fields {
        type
        name
        label
        value
      }
    }
  }
`;

export const GenericUserLicenseFragment = gql`
  fragment GenericUserLicenseFragment on GenericUserLicense {
    nationalId
    license {
      type
      provider {
        id
      }
      pkpass
      pkpassStatus
      timeout
      status
    }
    fetch {
      status
      updated
    }
    payload {
      data {
        ...GenericLicenseDataFieldFragment
      }
      rawData
    }
  }
`;


export interface IGenericLicenseDataField {
  type: string;
  name: string;
  label: string;
  value: string;
  fields: Array<{
    type: string;
    name: string;
    label: string;
    value: string;
    fields: Array<{
      type: string;
      name: string;
      label: string;
      value: string;
    }>
  }>
}

export enum GenericUserLicenseStatus {
  Unknown = 'Unknown',
  HasLicense = 'HasLicense',
  NotAvailable = 'NotAvailable',
}

export enum GenericUserLicensePkPassStatus {
  Unknown = 'Unknown',
  Available = 'Available',
  NotAvailable = 'NotAvailable',
}

export enum GenericUserLicenseFetchStatus {
  Fetched = 'Fetched',
  NotFetched = 'NotFetched',
  Fetching = 'Fetching',
  Error = 'Error',
  Stale = 'Stale',
}

export interface IGenericUserLicense {
  nationalId: string;
  license: {
    type: string;
    provider: {
      id: string;
    }
    pkpass: boolean;
    pkpassStatus: GenericUserLicensePkPassStatus;
    timeout: number;
    status: GenericUserLicenseStatus;
  }
  fetch: {
    status: GenericUserLicenseFetchStatus;
    updated: string;
  }
  payload: {
    data: IGenericLicenseDataField;
    rawData: string;
  }
}
