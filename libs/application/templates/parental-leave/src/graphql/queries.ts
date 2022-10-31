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

export const GetApplicationInformation = gql`
  query GetApplicationInformation(
    $applicationId: String!
    $nationalId: String!
    $employerNationalId: String!
  ) {
    getApplicationInformation(
      applicationId: $applicationId
      nationalId: $nationalId
      employerNationalId: $employerNationalId
    ) {
      periods {
        from
        to
        ratio
        paid
        firstPeriodStart
      }
    }
  }
`
