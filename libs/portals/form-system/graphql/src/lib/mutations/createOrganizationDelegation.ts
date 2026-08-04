import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION_DELEGATION = gql`
  mutation CreateFormSystemOrganizationDelegation(
    $input: FormSystemUpdateOrganizationDelegationInput!
  ) {
    createFormSystemOrganizationDelegation(input: $input)
  }
`
