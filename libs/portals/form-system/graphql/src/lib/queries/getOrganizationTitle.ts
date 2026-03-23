import { gql } from '@apollo/client'

export const GET_ORGANIZATION_TITLE = gql`
  query FormSystemOrganizationTitle(
    $input: FormSystemGetOrganizationAdminInput!
  ) {
    formSystemOrganizationTitle(input: $input)
  }
`
