import { gql } from '@apollo/client'

export const DELETE_ORGANIZATION_URL = gql`
  mutation DeleteFormSystemOrganizationUrl(
    $input: FormSystemDeleteOrganizationUrlInput!
  ) {
    deleteFormSystemOrganizationUrl(input: $input)
  }
`
