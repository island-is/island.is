import gql from 'graphql-tag'

export const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const GetCurrencies = gql`
  query GetCurrencies {
    getCurrencies
  }
`
