import gql from 'graphql-tag'

export const GET_USER = gql`
  {
    getUser(id: 10) {
      name
      mobile
      meetsADSRequirements
    }
  }
`
