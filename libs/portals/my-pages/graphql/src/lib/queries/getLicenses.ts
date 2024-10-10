import { gql } from '@apollo/client'
import {
  dataFragment,
  licenseFragment,
  fetchFragment,
} from '../fragments/license'

export const GET_GENERIC_LICENSES = gql`
  query GenericLicensesQuery(
    $input: GetGenericLicensesInput!
    $locale: String
  ) {
    genericLicenses(input: $input, locale: $locale) {
      nationalId
      license {
        ...License
      }
      fetch {
        ...Fetch
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
  ${licenseFragment}
  ${fetchFragment}
`

export const GET_GENERIC_LICENSE = gql`
  query GenericLicenseQuery($input: GetGenericLicenseInput!, $locale: String) {
    genericLicense(input: $input, locale: $locale) {
      nationalId
      license {
        ...License
      }
      fetch {
        ...Fetch
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
  ${licenseFragment}
  ${fetchFragment}
`
