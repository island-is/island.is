import { gql } from '@apollo/client'

export const GET_ORGANIZATION_ZENDESK_INSTANCE = gql`
  query FormSystemOrganizationZendeskInstance(
    $input: FormSystemGetOrganizationAdminInput!
  ) {
    formSystemOrganizationZendeskInstance(input: $input)
  }
`
