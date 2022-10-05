import gql from 'graphql-tag'

export const AUTH_DELEGATION_QUERY = gql`
  query AuthDelegation($input: AuthDelegationInput!) {
    authDelegation(input: $input) {
      id
      type
      to {
        nationalId
        name
      }
      from {
        nationalId
      }
      ... on AuthCustomDelegation {
        validTo
        scopes {
          id
          name
          type
          validTo
          displayName
        }
      }
    }
  }
`

export const AUTH_DELEGATIONS_QUERY = gql`
  query AuthDelegations {
    authDelegations {
      id
      type
      to {
        nationalId
        name
      }
      ... on AuthCustomDelegation {
        validTo
        scopes {
          id
          name
          displayName
          validTo
        }
      }
    }
  }
`

export const AUTH_DELEGATIONS_LIST_QUERY = gql`
  query AuthDelegationsList {
    authDelegations {
      ... on AuthCustomDelegation {
        validTo
      }
    }
  }
`
