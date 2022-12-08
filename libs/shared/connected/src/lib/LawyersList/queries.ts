import gql from 'graphql-tag'

export const GET_LAWYERS_QUERY = gql`
  query GetLawyers {
    getLawyers {
      name
      licenceType
    }
  }
`
