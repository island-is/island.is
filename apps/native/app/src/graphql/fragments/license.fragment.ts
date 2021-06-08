import { gql } from '@apollo/client';

export const LicenseDataFieldFragment = gql`
  fragment LicenseDataFieldFragment on GenericLicenseDataField {
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

export const LicenseFragment = gql`
  fragment LicenseFragment on GenericLicense {
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
    payload {
      data {
        ...LicenseDataFieldFragment
      }
      rawData
    }
  }
  ${LicenseDataFieldFragment}
`;


export interface ILicenseDataField {
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

export interface ILicense {
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
  fetch: {
    status: string;
    updated: string;
  }
  payload: {
    data: ILicenseDataField;
    rawData: string;
  }
}
