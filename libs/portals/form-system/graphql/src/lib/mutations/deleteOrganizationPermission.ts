import { gql } from '@apollo/client'

export const DELETE_ORGANIZATION_PERMISSION = gql`
  mutation DeleteFormSystemOrganizationPermission(
    $input: FormSystemUpdateOrganizationPermissionInput!
  ) {
    deleteFormSystemOrganizationPermission(input: $input)
  }
`
