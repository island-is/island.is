import { gql } from '@apollo/client'
import { dataFragment } from '../fragments/license'

export const GET_GENERIC_LICENSES = gql`
  query GenericLicensesQuery(
    $input: GetGenericLicensesInput!
    $locale: String
  ) {
    genericLicenses(input: $input, locale: $locale) {
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
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
`

export const GET_GENERIC_LICENSES = gql`
  query GenericLicensesQuery(
    $input: GetGenericLicensesInput!
    $locale: String
  ) {
    genericLicenses(input: $input, locale: $locale) {
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
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
`

export const GET_GENERIC_LICENSE = gql`
  query GenericLicenseQuery($input: GetGenericLicenseInput!, $locale: String) {
    genericLicense(input: $input, locale: $locale) {
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
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
`
