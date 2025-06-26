import { gql } from '@apollo/client'

export const UPDATE_ORGANIZATION_URL = gql`
  mutation UpdateFormSystemOrganizationUrl(
    $input: FormSystemUpdateOrganizationUrlInput!
  ) {
    updateFormSystemOrganizationUrl(input: $input)
  }
`
