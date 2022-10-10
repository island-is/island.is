import gql from 'graphql-tag'

export const GET_REAL_ESTATE_AGENTS_QUERY = gql`
  query GetRealEstateAgents {
    getRealEstateAgents {
      name
      location
    }
  }
`
