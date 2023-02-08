import { gql } from '@apollo/client'

export const UpdateIndictmentCountMutation = gql`
  mutation UpdateIndictmentCountMutation($input: UpdateIndictmentCountInput!) {
    updateIndictmentCount(input: $input) {
      id
      caseId
      created
      policeCaseNumber
      vehicleRegistrationNumber
      incidentDescription
      legalArguments
    }
  }
`
