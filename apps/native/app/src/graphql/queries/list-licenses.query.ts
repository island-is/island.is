import { gql } from '@apollo/client';
import { LicenseDataFieldFragment } from '../fragments/license.fragment';

export const LIST_LICENSES_QUERY = gql`
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
