import gql from 'graphql-tag'

export const siaUnionsQuery = gql`
  query SiaUnions {
    siaGetUnions {
      nationalId
      name
    }
  }
`
