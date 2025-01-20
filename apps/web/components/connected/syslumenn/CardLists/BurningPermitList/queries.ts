import gql from 'graphql-tag'

export const GET_BURNING_PERMITS_QUERY = gql`
  query GetBurningPermits {
    getBurningPermits {
      date
      type
      subtype
      responsibleParty
      office
      licensee
      place
    }
  }
`
