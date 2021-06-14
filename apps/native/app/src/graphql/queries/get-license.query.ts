import { gql } from '@apollo/client'
import {
  GenericUserLicenseFragment,
  IGenericUserLicense,
} from '../fragments/license.fragment'

export const GET_GENERIC_LICENSE_QUERY = gql`
  query getGenericLicense($input: GetGenericLicenseInput!) {
    genericLicense(input: $input) {
      ...GenericLicenseFragment
    }
  }
  ${GenericUserLicenseFragment}
`

export interface GetLicenseResponse {
  genericLicense?: IGenericUserLicense
}

export interface GetGenericLicenseInput {
  input: {
    providerId: string
    licenseType: string[]
    licenseId: string
  }
}
