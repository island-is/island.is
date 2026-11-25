import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION = gql`
  mutation CreateFormSystemOrganization(
    $input: FormSystemCreateOrganizationInput!
  ) {
    createFormSystemOrganization(input: $input)
  }
`
