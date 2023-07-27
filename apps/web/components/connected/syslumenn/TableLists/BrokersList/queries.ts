import gql from 'graphql-tag'

export const GET_BROKERS_QUERY = gql`
  query GetBrokers {
    getBrokers {
      name
      nationalId
    }
  }
`
