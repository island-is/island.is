import gql from 'graphql-tag'

export const GetUnions = gql`
  query GetUnions {
    getUnions {
      id
      name
    }
  }
`

export const GetPensionFunds = gql`
  query GetPensionFunds {
    getPensionFunds {
      id
      name
    }
  }
`

export const GetPrivatePensionFunds = gql`
  query GetPrivatePensionFunds {
    getPrivatePensionFunds {
      id
      name
    }
  }
`
