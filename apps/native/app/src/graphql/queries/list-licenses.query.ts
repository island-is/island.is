import { gql } from '@apollo/client';
import { LicenseDataFieldFragment } from '../fragments/license.fragment';
export const LIST_LICENSES_QUERY = gql`
  query {
    listLicenses @client {
      id
      title
      type
      status
      dateTime
      serviceProvider
    }
  }
`;

export const NEW_LICENSES_QUERY = gql`
  query {
    listLicenses @client {
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
  }
  ${LicenseDataFieldFragment} 
`;