import { gql } from '@apollo/client'

export const DELETE_ORGANIZATION_PERMISSION = gql`
  mutation FormSystemDeleteOrganizationPermission(
    $input: FormSystemUpdateOrganizationPermissionInput!
  ) {
    formSystemDeleteOrganizationPermission(input: $input)
  }
`
