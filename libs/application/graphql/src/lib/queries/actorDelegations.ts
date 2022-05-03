import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const ACTOR_DELEGATIONS = gql`
  query ActorDelegations {
    authActorDelegations {
      type
      from {
        nationalId
        name
      }
    }
  }
`
