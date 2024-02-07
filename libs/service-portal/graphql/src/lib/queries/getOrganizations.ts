import { gql } from '@apollo/client'

const OrganizationFragment = gql`
  fragment OrganizationFragment on Organization {
    id
    title
    slug
    link
    logo {
      id
      url
      title
    }
  }
`

export const GET_ORGANIZATION_QUERY = gql`
  query getOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      ...OrganizationFragment
    }
  }
  ${OrganizationFragment}
`

export const GET_ORGANIZATIONS_QUERY = gql`
  query getOrganizations($input: GetOrganizationsInput) {
    getOrganizations(input: $input) {
      items {
        ...OrganizationFragment
      }
    }
  }
  ${OrganizationFragment}
`
