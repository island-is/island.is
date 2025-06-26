import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION_URL = gql`
  mutation CreateFormSystemOrganizationUrl(
    $input: FormSystemCreateOrganizationUrlInput!
  ) {
    createFormSystemOrganizationUrl(input: $input) {
      id
      url
      isXroad
      isTest
      type
      method
    }
  }
`
