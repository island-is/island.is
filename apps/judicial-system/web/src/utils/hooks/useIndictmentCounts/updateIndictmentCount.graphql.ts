import { gql } from '@apollo/client'

export const UpdateIndictmentCountMutation = gql`
  mutation UpdateIndictmentCountMutation($input: UpdateIndictmentCountInput!) {
    updateIndictmentCount(input: $input) {
      id
      caseId
      policeCaseNumber
      vehicleRegistrationNumber
      offenses
      lawsBroken
      incidentDescription
      legalArguments
      offenses
    }
  }
`
