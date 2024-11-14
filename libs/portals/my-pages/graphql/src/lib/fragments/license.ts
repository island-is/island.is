import { gql } from '@apollo/client'

export const dataFragment = gql`
  fragment genericLicenseDataFieldFragment on GenericLicenseDataField {
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
`

export const licenseFragment = gql`
  fragment License on GenericLicense {
    type
    provider {
      id
    }
    pkpass
    timeout
    status
  }
`

export const fetchFragment = gql`
  fragment Fetch on GenericLicenseFetch {
    status
    updated
  }
`
