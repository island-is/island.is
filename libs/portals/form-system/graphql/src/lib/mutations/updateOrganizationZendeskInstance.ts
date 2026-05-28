import { gql } from '@apollo/client'

export const UPDATE_ORGANIZATION_ZENDESK_INSTANCE = gql`
  mutation UpdateOrganizationZendeskInstance(
    $input: FormSystemOrganizationZendeskInstanceInput!
  ) {
    formSystemUpdateOrganizationZendeskInstance(input: $input)
  }
`
