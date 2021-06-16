import { gql } from '@apollo/client'
import {
  GenericLicenseDataFieldFragment,
  GenericUserLicenseFragment,
  IGenericUserLicense,
} from '../fragments/license.fragment'

export const GET_GENERIC_LICENSE_QUERY = gql`
  query getGenericLicense($input: GetGenericLicenseInput!) {
    genericLicense(input: $input) {
      ...GenericUserLicenseFragment
    }
  }
  ${GenericUserLicenseFragment}
  ${GenericLicenseDataFieldFragment}
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
