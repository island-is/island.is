import gql from 'graphql-tag'

export const GET_RELIGIOUS_ORGANIZATIONS_QUERY = gql`
  query GetReligiousOrganizationsQuery {
    getReligiousOrganizations {
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
