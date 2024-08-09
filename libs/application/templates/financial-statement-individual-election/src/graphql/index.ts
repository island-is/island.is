import { gql } from '@apollo/client'

export const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`
export const getAvailableElections = gql`
  query FinancialStatementsInaoElections {
    financialStatementsInaoElections {
      electionId
      name
      electionDate
      genitiveName
    }
  }
`

export const getFinancialLimit = gql`
  query FinancialStatementsInaoClientFinancialLimit(
    $input: InaoClientFinancialLimitInput!
  ) {
    financialStatementsInaoClientFinancialLimit(input: $input)
  }
`
