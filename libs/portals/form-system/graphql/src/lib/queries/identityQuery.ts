import { gql } from '@apollo/client'

export const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
      givenName
      familyName
      address {
        streetAddress
        postalCode
        city
      }
      type
    }
  }
`

export const DECEASED_IDENTITY_QUERY = gql`
  query DeceasedIdentityQuery($input: GetRegistryPersonInput!) {
    syslumennGetRegistryPerson(input: $input) {
      name
    }
  }
`
