import gql from 'graphql-tag'

export const UPDATE_AUTH_DELEGATION_MUTATION = gql`
  mutation UpdateAuthDelegation($input: UpdateAuthDelegationInput!) {
    updateAuthDelegation(input: $input) {
      id
      from {
        nationalId
      }
      ... on AuthCustomDelegation {
        scopes {
          id
          name
          validTo
          displayName
        }
      }
    }
  }
`

export const DELETE_AUTH_DELEGATION_MUTATION = gql`
  mutation DeleteAuthDelegation($input: DeleteAuthDelegationInput!) {
    deleteAuthDelegation(input: $input)
  }
`

export const CREATE_AUTH_DELEGATION_MUTATION = gql`
  mutation CreateAuthDelegation($input: CreateAuthDelegationInput!) {
    createAuthDelegation(input: $input) {
      id
      to {
        nationalId
      }
    }
  }
`
