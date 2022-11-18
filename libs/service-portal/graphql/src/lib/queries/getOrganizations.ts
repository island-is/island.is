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
