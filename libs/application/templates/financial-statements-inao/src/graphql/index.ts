import { gql } from '@apollo/client'

export const getAvailableElections = gql`
  query FinancialStatementsInaoElections {
    financialStatementsInaoElections {
      electionId
      name
      electionDate
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

export const getAuditConfig = gql`
  query FinancialStatementsInaoConfig {
    financialStatementsInaoConfig {
      value
      key
    }
  }
`
