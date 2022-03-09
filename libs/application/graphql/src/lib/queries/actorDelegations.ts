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
export const APPLICANT_DELEGATIONS = gql`
  query delegationApplicantApplication($input: ApplicationApplicationInput!) {
    delegationApplicantApplication(input: $input) {
      applicant
    }
  }
`
