import { gql } from '@apollo/client'

export const CreateIndictmentCountMutation = gql`
  mutation CreateIndictmentCount($input: CreateIndictmentCountInput!) {
    createIndictmentCount(input: $input) {
      id
      caseId
      policeCaseNumber
      vehicleRegistrationNumber
      offenses
      substances
      lawsBroken
      incidentDescription
      legalArguments
    }
  }
`
