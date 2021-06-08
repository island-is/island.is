import { gql } from '@apollo/client'
import { ILicense } from '../fragments/license.fragment'

export const GET_LICENSE_QUERY = gql`
  query getLicense($id: ID!) {
    License(id: $id) @client {
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
        rawData
      }
    }
  }
`

export interface GetLicenseResponse {
  License?: ILicense;
}
