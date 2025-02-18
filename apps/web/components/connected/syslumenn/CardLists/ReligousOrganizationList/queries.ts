import gql from 'graphql-tag'

export const GET_RELIGOUS_ORGANIZATIONS_QUERY = gql`
  query GetReligousOrganizationsQuery {
    getReligousOrganizations {
      list {
        director
        name
        homeAddress
        postalCode
        municipality
      }
    }
  }
`
