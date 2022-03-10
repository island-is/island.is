import { gql } from '@apollo/client'

const OrganizationFragment = gql`
  fragment OrganizationFragment on Organization {
    id
    title
    logo {
      id
      url
      title
    }
  }
`

export const GET_ORGANIZATIONS_QUERY = gql`
  query getOrganizations {
    getOrganizations(input: { lang: "is-IS", perPage: 200 }) {
      items {
        ...OrganizationFragment
      }
    }
  }
  ${OrganizationFragment}
`
