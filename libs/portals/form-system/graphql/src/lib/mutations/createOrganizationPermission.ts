import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION_PERMISSION = gql`
  mutation CreateFormSystemOrganizationPermission(
    $input: FormSystemUpdateOrganizationPermissionInput!
  ) {
    createFormSystemOrganizationPermission(input: $input) {
      permission
    }
  }
`
