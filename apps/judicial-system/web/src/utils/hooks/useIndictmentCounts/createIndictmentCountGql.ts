import { gql } from '@apollo/client'

export const CreateIndictmentCountMutation = gql`
  mutation CreateIndictmentCountMutation($input: CreateIndictmentCountInput!) {
    createIndictmentCount(input: $input) {
      id
      caseId
      policeCaseNumber
      vehicleRegistrationNumber
      lawsBroken
      incidentDescription
      legalArguments
    }
  }
`
