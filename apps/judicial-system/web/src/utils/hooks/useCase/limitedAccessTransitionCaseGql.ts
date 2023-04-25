import { gql } from '@apollo/client'

export const LimitedAccessTransitionCaseMutation = gql`
  mutation LimitedAccessTransitionCaseMutation($input: TransitionCaseInput!) {
    limitedAccessTransitionCase(input: $input) {
      state
      appealState
      appealReceivedByCourtDate
    }
  }
`
