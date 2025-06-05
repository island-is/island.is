import gql from 'graphql-tag'

export const siaUnionsQuery = gql`
  query SiaUnions {
    socialInsuranceUnions {
      nationalId
      name
    }
  }
`
