import { gql } from '@apollo/client'

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
query delegationApplicantApplication(
  $input: delegationApplicantApplication!

) {
  delegationApplicantApplication(input: $input) {
    data
  }
}
`
