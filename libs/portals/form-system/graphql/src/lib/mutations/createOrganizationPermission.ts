import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION_PERMISSION = gql`
  mutation FormSystemCreateOrganizationPermission(
    $input: FormSystemUpdateOrganizationPermissionInput!
  ) {
    formSystemCreateOrganizationPermission(input: $input) {
      permission
    }
  }
`
