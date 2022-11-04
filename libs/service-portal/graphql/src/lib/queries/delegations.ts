import gql from 'graphql-tag'
import { authCustomDelegationFragment } from '../fragments/customDelegation'

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

// TODO: Remove this query when delegations to me are implemented
export const AUTH_ACTOR_DELEGATIONS_QUERY = gql`
  query AuthActorDelegations($input: AuthActorDelegationInput, $lang: String) {
    authActorDelegations(input: $input) {
      id
      type
      to {
        nationalId
        name
      }
      provider
      ... on AuthCustomDelegation {
        ...AuthCustomDelegationFragment
      }
    }
  }
`
