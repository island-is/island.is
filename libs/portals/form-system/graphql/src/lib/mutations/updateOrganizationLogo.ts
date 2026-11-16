import { gql } from '@apollo/client'

export const UPDATE_ORGANIZATION_LOGO = gql`
  mutation FormSystemUpdateOrganizationLogo(
    $input: FormSystemOrganizationLogoInput!
  ) {
    formSystemUpdateOrganizationLogo(input: $input)
  }
`
