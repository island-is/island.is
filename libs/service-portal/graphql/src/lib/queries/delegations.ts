import gql from 'graphql-tag'
import { authCustomDelegationFragment } from '../fragments/customDelegation'

// Delegation outgoing
export const AUTH_DELEGATION_QUERY = gql`
  query AuthDelegation($input: AuthDelegationInput!, $lang: String) {
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
        ...AuthCustomDelegationFragment
      }
    }
  }
  ${authCustomDelegationFragment}
`

// Delegations outgoing
export const AUTH_DELEGATIONS_QUERY = gql`
  query AuthDelegations($input: AuthDelegationsInput!, $lang: String) {
    authDelegations(input: $input) {
      id
      type
      to {
        nationalId
        name
      }
      ... on AuthCustomDelegation {
        ...AuthCustomDelegationFragment
      }
    }
  }
  ${authCustomDelegationFragment}
`

// Delegations Incoming
// TODO use real delegation incoming query when ready in Graphql
export const AUTH_DELEGATIONS_INCOMING_QUERY = gql`
  query AuthDelegationsIncoming($input: AuthDelegationsInput!) {
    authDelegations(input: $input) {
      id
      type
      from {
        nationalId
        name
      }
      ... on AuthCustomDelegation {
        validTo
        scopes {
          id
          name
          validTo
          displayName
        }
        domain {
          name
          displayName
          organisationLogoKey
          organisationLogoUrl
        }
      }
    }
  }
`
