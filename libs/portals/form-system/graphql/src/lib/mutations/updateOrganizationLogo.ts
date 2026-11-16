import { gql } from '@apollo/client'

export const UPDATE_ORGANIZATION_LOGO = gql`
  mutation UpdateFormSystemOrganizationLogo(
    $input: FormSystemOrganizationLogoInput!
  ) {
    updateFormSystemOrganizationLogo(input: $input)
  }
`
