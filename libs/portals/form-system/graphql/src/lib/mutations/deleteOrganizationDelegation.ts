import { gql } from '@apollo/client'

export const DELETE_ORGANIZATION_DELEGATION = gql`
  mutation DeleteFormSystemOrganizationDelegation(
    $input: FormSystemUpdateOrganizationDelegationInput!
  ) {
    deleteFormSystemOrganizationDelegation(input: $input)
  }
`
