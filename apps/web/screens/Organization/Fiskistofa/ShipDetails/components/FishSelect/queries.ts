import gql from 'graphql-tag'

export const GET_ALL_FISHES_QUERY = gql`
  query GetAllFishes {
    getAllFishes {
      id
      name
    }
  }
`
