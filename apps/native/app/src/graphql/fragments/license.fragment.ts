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
    payload {
      data {
        ...LicenseDataFieldFragment
      }
      rawData
    }
  }
  ${LicenseDataFieldFragment}
`;
