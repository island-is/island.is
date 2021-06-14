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
      timeout
      status
    }
    fetch {
      status
      updated
    }
    pkpassUrl
    payload {
      data {
        ...GenericLicenseDataFieldFragment
      }
      rawData
    }
  }
  ${GenericLicenseDataFieldFragment}
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

export interface IGenericUserLicense {
  nationalId: string;
  license: {
    type: string;
    provider: {
      id: string;
    }
    pkpass: string;
    timeout: string;
    status: string;
  }
  pkpassUrl: string;
  fetch: {
    status: string;
    updated: string;
  }
  payload: {
    data: IGenericLicenseDataField;
    rawData: string;
  }
}
