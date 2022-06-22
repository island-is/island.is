import { gql } from '@apollo/client'

export const ACTOR_DELEGATIONS = gql`
  query ActorDelegations($input: AuthActorDelegationInput!) {
    authActorDelegations(input: $input) {
      type
      from {
        nationalId
        name
      }
    }
  }
`
